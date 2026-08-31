// eBPF C program for tracking file open operations (sys_enter_openat)
// +build ignore

#include "headers/vmlinux.h"

struct {
    __uint(type, BPF_MAP_TYPE_RINGBUF);
    __uint(max_entries, 1024 * 256);
} openat_events SEC(".maps");

SEC("tracepoint/syscalls/sys_enter_openat")
int tracepoint_sys_enter_openat(void *ctx) {
    struct file_open_event *event;
    
    event = bpf_ringbuf_reserve(&openat_events, sizeof(struct file_open_event), 0);
    if (!event) {
        return 0;
    }

    __u64 pid_tgid = bpf_get_current_pid_tgid();
    event->pid = (u32)(pid_tgid >> 32);
    event->uid = (u32)bpf_get_current_uid_gid();
    event->timestamp_ns = bpf_ktime_get_ns();
    
    bpf_get_current_comm(&event->comm, sizeof(event->comm));
    
    // Read filename argument from tracepoint context (offset 16 for openat dfd, filename, flags)
    const char *ctx_bytes = (const char *)ctx;
    bpf_probe_read_user_str(&event->filename, sizeof(event->filename), (const void *)*((const __u64 *)(ctx_bytes + 16)));

    bpf_ringbuf_submit(event, 0);
    return 0;
}

char _license[] SEC("license") = "GPL";
