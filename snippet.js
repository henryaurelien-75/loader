(function () {
  const CONFIG = {
    TARGET_DOMAINS: ["successfactors", ".hr.cloud.sap", ".plateau.com"],

    // <<< TON OPENWEBUI LOCAL
    AI_CHAT_URL: "http://192.168.1.131:3050/",

    POLLING_INTERVAL: 50,
    POLLING_TIMEOUT: 15000
  };

  let injected = false;
  let timer = null;

  function isTargetEnvironment() {
    return CONFIG.TARGET_DOMAINS.some(d => location.href.includes(d));
  }

  function addAIChatPanel() {
    if (document.getElementById("openwebui-panel")) return;

    const iframe = document.createElement("iframe");
    iframe.id = "openwebui-panel";
    iframe.src = CONFIG.AI_CHAT_URL;
    iframe.style.position = "fixed";
    iframe.style.top = "0";
    iframe.style.right = "0";
    iframe.style.width = "420px";
    iframe.style.height = "100vh";
    iframe.style.border = "none";
    iframe.style.zIndex = "999999";
    iframe.style.background = "white";
    iframe.style.boxShadow = "0 0 20px rgba(0,0,0,0.3)";

    document.body.appendChild(iframe);
  }

  function toggleAIChatPanel() {
    const panel = document.getElementById("openwebui-panel");
    if (panel) {
      panel.remove();
    } else {
      addAIChatPanel();
    }
  }

  function addAIButton() {
    if (document.getElementById("openwebui-button")) return;

    const btn = document.createElement("div");
    btn.id = "openwebui-button";
    btn.innerText = "IA";
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.style.width = "60px";
    btn.style.height = "60px";
    btn.style.background = "#4a6cf7";
    btn.style.color = "white";
    btn.style.borderRadius = "50%";
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.cursor = "pointer";
    btn.style.zIndex = "1000000";
    btn.style.fontSize = "20px";
    btn.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
    btn.style.userSelect = "none";

    btn.onclick = toggleAIChatPanel;

    document.body.appendChild(btn);
  }

  function tryInject() {
    if (injected) return;

    if (!isTargetEnvironment()) {
      clearInterval(timer);
      return;
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
      addAIButton();
      injected = true;
      clearInterval(timer);
    }
  }

  function start() {
    const startTime = Date.now();
    timer = setInterval(() => {
      if (Date.now() - startTime > CONFIG.POLLING_TIMEOUT) {
        clearInterval(timer);
        return;
      }
      tryInject();
    }, CONFIG.POLLING_INTERVAL);
  }

  start();
})();
