export interface IServiceCheck {
    http?: string;
    tcp?: string;
    script?: string;
    dockercontainerid?: string;
    shell?: string;
    interval?: string;
    timeout?: string;
    ttl?: string;
    notes?: string;
    status?: string;
    deregistercriticalserviceafter?: string;
}
