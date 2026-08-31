// eBPF C program for tracking process execution (sys_enter_execve)
// +build ignore

#include "headers/vmlinux.h"

struct {
    __uint(type, BPF_MAP_TYPE_RINGBUF);
    __uint(max_entries, 1024 * 128);
} execve_events SEC(".maps");

SEC("tracepoint/syscalls/sys_enter_execve")
int tracepoint_sys_enter_execve(void *ctx) {
    struct process_exec_event *event;

    event = bpf_ringbuf_reserve(&execve_events, sizeof(struct process_exec_event), 0);
    if (!event) {
        return 0;
    }

    __u64 pid_tgid = bpf_get_current_pid_tgid();
    event->pid = (u32)(pid_tgid >> 32);
    event->uid = (u32)bpf_get_current_uid_gid();
    event->timestamp_ns = bpf_ktime_get_ns();

    bpf_get_current_comm(&event->comm, sizeof(event->comm));
    
    const char *ctx_bytes = (const char *)ctx;
    bpf_probe_read_user_str(&event->filename, sizeof(event->filename), (const void *)*((const __u64 *)(ctx_bytes + 8)));

    bpf_ringbuf_submit(event, 0);
    return 0;
}

char _license[] SEC("license") = "GPL";
