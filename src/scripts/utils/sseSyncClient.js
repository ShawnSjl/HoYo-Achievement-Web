import {EventSourcePolyfill} from "event-source-polyfill";

export class SseSyncClient {

    /**
     * Create a new SSE sync client.
     * @param {Object} config
     * @param {String} config.clientId
     * @param {Function} config.onSyncNeeded
     * @param {Function} config.onMessageReceived
     */
    constructor({clientId, onSyncNeeded, onMessageReceived}) {
        this.clientId = clientId;
        this.onSyncNeeded = onSyncNeeded;
        this.onMessageReceived = onMessageReceived;

        this.sseSource = null;
        this.isPageActive = true;
        this.wasSuspenedInBackground = false;

        this.reconnectAttempts = 0;      // 当前连续失败的重连次数
        this.baseDelay = 1000;           // 基础延迟时间：1000毫秒 (1秒)
        this.maxDelay = 30000;          // 最大延迟上限：30秒（防止无限翻倍导致时间过长）
        this.reconnectTimer = null;      // 托管重连的定时器
    }

    start() {
        // Full sync when the sse start
        if (this.onSyncNeeded) {
            this.onSyncNeeded();
        }

        this.connectSse();

        this.initVisibilityListener();
    }

    connectSse() {
        if (this.sseSource) {
            this.sseSource.close();
        }
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }

        // Create a new EventSource instance
        this.sseSource = new EventSourcePolyfill(`/api/sse/connect?clientId=${this.clientId}`, {
            withCredentials: true,
        });

        this.sseSource.onOpen = () => {
            console.log('SSE connected');
            this.reconnectAttempts = 0;
        }

        this.sseSource.addEventListener('handshake', (event) => {
            console.log('SSE handshake:', event.data);
        })

        this.sseSource.addEventListener('data_changed', (event) => {
            console.log('SSE data changed:', event.data);
            if (this.onMessageReceived) {
                this.onMessageReceived(JSON.parse(event.data));
            }
        })

        this.sseSource.addEventListener('heartbeat', (event) => {
            console.log('SSE heartbeat:', event.data);
        })

        this.sseSource.onerror = (error) => {
            if (this.sseSource.readyState === EventSource.CONNECTING) {
                console.log('SSE connection failed, retrying...');
                return;
            }

            console.error('SSE error:', error);
            this.sseSource.close();

            if (this.isPageActive) {
                console.log('Reconnecting SSE...');
                this.triggerExponentialBackoff();
            } else {
                this.wasSuspenedInBackground = true;
            }
        }
    }

    triggerExponentialBackoff() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }

        let delay = this.baseDelay * Math.pow(2, this.reconnectAttempts);

        // 引入“抖动机制 (Jitter)”：在计算出的时间上加减一个随机数（例如上下浮动10%）
        // 目的：防止多台设备由于同时断网，算出来的退避时间一模一样，导致再次并发撞墙
        const jitter = (Math.random() - 0.5) * 0.2 * delay;
        delay = Math.min(this.maxDelay, delay + jitter);

        this.reconnectTimer = setTimeout(() => {
            this.reconnectAttempts++;
            this.connectSse();
        }, delay);
    }

    initVisibilityListener() {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                console.log('Page became visible');
                this.isPageActive = true;

                console.log('Full sync when the page became visible');
                if (this.onSyncNeeded) {
                    this.onSyncNeeded();
                }

                // Reconnect if the SSE was suspended in the background
                if (this.wasSuspenedInBackground || !this.sseSource || this.sseSource.readyState !== EventSource.OPEN) {
                    console.log('Reconnecting SSE...');
                    this.wasSuspenedInBackground = false;
                    this.reconnectAttempts = 0;
                    this.connectSse();
                }
            } else {
                console.log('Page became hidden');
                this.isPageActive = false;
                if (this.reconnectTimer) {
                    clearTimeout(this.reconnectTimer);
                }
            }
        });
    }

    destroy() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }
        if (this.sseSource) {
            this.sseSource.close();
        }
        console.log('SSE connection closed');
    }
}