const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('env', {
    VITE_STAGE: import.meta.env.VITE_STAGE
});
