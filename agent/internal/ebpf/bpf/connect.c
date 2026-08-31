// eBPF C program for tracking network outbound connections (sys_enter_connect)
// +build ignore

#include "headers/vmlinux.h"

struct {
    __uint(type, BPF_MAP_TYPE_RINGBUF);
    __uint(max_entries, 1024 * 128);
} connect_events SEC(".maps");

SEC("tracepoint/syscalls/sys_enter_connect")
int tracepoint_sys_enter_connect(void *ctx) {
    struct network_connect_event *event;

    event = bpf_ringbuf_reserve(&connect_events, sizeof(struct network_connect_event), 0);
    if (!event) {
        return 0;
    }

    __u64 pid_tgid = bpf_get_current_pid_tgid();
    event->pid = (u32)(pid_tgid >> 32);
    event->uid = (u32)bpf_get_current_uid_gid();
    event->timestamp_ns = bpf_ktime_get_ns();

    bpf_get_current_comm(&event->comm, sizeof(event->comm));

    // Socket address pointer is offset 16 in sys_enter_connect
    const char *ctx_bytes = (const char *)ctx;
    const void *sockaddr_ptr = (const void *)*((const __u64 *)(ctx_bytes + 16));
    if (sockaddr_ptr) {
        __u16 family = 0;
        bpf_probe_read_user(&family, sizeof(family), sockaddr_ptr);
        event->family = family;
        if (family == 2) { // AF_INET
            const char *sock_bytes = (const char *)sockaddr_ptr;
            bpf_probe_read_user(&event->dport, sizeof(event->dport), sock_bytes + 2);
            bpf_probe_read_user(&event->daddr, sizeof(event->daddr), sock_bytes + 4);
        }
    }

    bpf_ringbuf_submit(event, 0);
    return 0;
}

char _license[] SEC("license") = "GPL";
