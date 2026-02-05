(function () {
  const CONFIG = {
    TARGET_DOMAINS: ["successfactors", ".hr.cloud.sap", ".plateau.com"],
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

    const container = document.createElement("div");
    container.id = "openwebui-panel";
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.right = "0";
    container.style.width = "420px";
    container.style.height = "100vh";
    container.style.zIndex = "999999";
    container.style.background = "#d9ecff";
    container.style.boxShadow = "0 0 20px rgba(0,0,0,0.3)";

    const iframe = document.createElement("iframe");
    iframe.src = CONFIG.AI_CHAT_URL;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";

    container.appendChild(iframe);
    document.body.appendChild(container);
  }

  function toggleAIChatPanel() {
    const panel = document.getElementById("openwebui-panel");
    if (panel) panel.remove();
    else addAIChatPanel();
  }

  function addAIButton() {
    if (document.getElementById("openwebui-button")) return;

    const btn = document.createElement("div");
    btn.id = "openwebui-button";

    // 👉 Mets ici l’URL de ton icône hébergée
    const IA_ICON_URL = "TON_URL_IMAGE";

    btn.innerHTML = `<img id="ia-icon" src="${IA_ICON_URL}" alt="IA" />`;

    // Position du bouton (plus haut)
    btn.style.position = "fixed";
    btn.style.bottom = "250px";  // Ajuste ici pour monter/descendre
    btn.style.right = "25px";

    // Taille du conteneur (plus discret)
    btn.style.width = "80px";
    btn.style.height = "80px";

    // Style général (plus de forme ronde)
    btn.style.backgroundColor = "transparent";
    btn.style.borderRadius = "12px"; // léger arrondi
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.cursor = "pointer";
    btn.style.zIndex = "1000000";
    btn.style.userSelect = "none";
    btn.style.transition = "transform 0.3s ease";

    // Style de l’icône
    const style = document.createElement("style");
    style.innerHTML = `
      #ia-icon {
        width: 70px;
        height: 70px;
        border-radius: 10px;
        border: 2px solid white; /* léger contour blanc */
        box-shadow: 0 4px 10px rgba(0,0,0,0.15);
      }

      @keyframes iaBlink {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.10); opacity: 0.6; }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    // Animation d’apparition
    btn.style.animation = "iaBlink 1s ease-in-out 0s 1";

    // Hover
    btn.onmouseenter = () => {
      btn.style.transform = "scale(1.08)";
    };
    btn.onmouseleave = () => {
      btn.style.transform = "scale(1)";
    };

    // Action
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
