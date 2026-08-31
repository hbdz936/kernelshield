/* Minimal eBPF kernel definitions for KernelShield */
#ifndef __VMLINUX_H__
#define __VMLINUX_H__

typedef unsigned char __u8;
typedef unsigned short __u16;
typedef unsigned int __u32;
typedef unsigned long long __u64;

typedef signed char __s8;
typedef signed short __s16;
typedef signed int __s32;
typedef signed long long __s64;

typedef __u16 __sum16;
typedef __u32 __wsum;

#ifndef NULL
#define NULL ((void *)0)
#endif

#define PATH_MAX 256
#define COMM_MAX 16

/* eBPF Macro & Helper Stub definitions for IDE IntelliSense & Clang Compiler */
#ifndef SEC
#define SEC(name) __attribute__((section(name), used))
#endif

#ifndef __uint
#define __uint(name, val) int (*name)[val]
#endif

#ifndef BPF_MAP_TYPE_RINGBUF
#define BPF_MAP_TYPE_RINGBUF 27
#endif

/* BPF Helper Function Declarations */
static void *(*bpf_ringbuf_reserve)(void *ringbuf, __u64 size, __u64 flags) = (void *) 131;
static void (*bpf_ringbuf_submit)(void *data, __u64 flags) = (void *) 132;
static __u64 (*bpf_get_current_pid_tgid)(void) = (void *) 14;
static __u64 (*bpf_get_current_uid_gid)(void) = (void *) 15;
static __u64 (*bpf_ktime_get_ns)(void) = (void *) 5;
static long (*bpf_get_current_comm)(void *buf, __u32 size_of_buf) = (void *) 16;
static long (*bpf_probe_read_user_str)(void *dst, __u32 size, const void *unsafe_ptr) = (void *) 114;
static long (*bpf_probe_read_user)(void *dst, __u32 size, const void *unsafe_ptr) = (void *) 112;

/* eBPF Event Structures */
struct file_open_event {
    __u32 pid;
    __u32 ppid;
    __u32 uid;
    char comm[COMM_MAX];
    char filename[PATH_MAX];
    __u64 timestamp_ns;
    __u32 flags;
};

struct file_write_event {
    __u32 pid;
    __u32 uid;
    char comm[COMM_MAX];
    char filename[PATH_MAX];
    __u64 bytes_written;
    __u64 timestamp_ns;
};

struct process_exec_event {
    __u32 pid;
    __u32 ppid;
    __u32 uid;
    char comm[COMM_MAX];
    char filename[PATH_MAX];
    __u64 timestamp_ns;
};

struct network_connect_event {
    __u32 pid;
    __u32 uid;
    char comm[COMM_MAX];
    __u32 daddr;
    __u16 dport;
    __u16 family;
    __u64 timestamp_ns;
};

#endif /* __VMLINUX_H__ */
