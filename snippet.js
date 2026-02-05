(function () {
  const CONFIG = {
    TARGET_DOMAINS: ["successfactors", ".hr.cloud.sap", ".plateau.com"],

    // Ton OpenWebUI local
    AI_CHAT_URL: "http://192.168.1.131:3050/",

    POLLING_INTERVAL: 50,
    POLLING_TIMEOUT: 15000
  };

  let injected = false;
  let timer = null;

  // Vérifie si on est dans SF / Plateau
  function isTargetEnvironment() {
    return CONFIG.TARGET_DOMAINS.some(d => location.href.includes(d));
  }

  // Panneau IA (iframe OpenWebUI)
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
    container.style.background = "#d9ecff"; // bleu clair
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
    if (panel) {
      panel.remove();
    } else {
      addAIChatPanel();
    }
  }

  // Bouton IA (fond personnalisé + étoile tournante)
  function addAIButton() {
    if (document.getElementById("openwebui-button")) return;

    const btn = document.createElement("div");
    btn.id = "openwebui-button";

    // Texte avec étoile animée
    btn.innerHTML = '<span id="ia-star">⭐</span> IA';

    // Position
    btn.style.position = "fixed";
    btn.style.bottom = "25px";
    btn.style.right = "25px";

    // Taille
    btn.style.width = "95px";
    btn.style.height = "95px";

    // Fond personnalisé
    btn.style.backgroundImage =
      "url('https://hcm-eu20-preview.hr.cloud.sap/public/ui-resource/viseoT1/274;mod=5a2cc83315671139d05a879997e23c08&resize=wsx')";
    btn.style.backgroundSize = "cover";
    btn.style.backgroundPosition = "center";
    btn.style.backgroundRepeat = "no-repeat";

    // Couleur fallback
    btn.style.backgroundColor = "#0a2a66";

    // Style général
    btn.style.color = "white";
    btn.style.borderRadius = "50%";
    btn.style.display = "flex";
    btn.style.flexDirection = "column";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.cursor = "pointer";
    btn.style.zIndex = "1000000";
    btn.style.fontSize = "26px";
    btn.style.fontWeight = "bold";
    btn.style.boxShadow = "0 6px 18px rgba(0,0,0,0.25)";
    btn.style.userSelect = "none";
    btn.style.transition = "transform 0.7s ease";

    // Animation du bouton (clignotement)
    btn.style.animation = "iaBlink 1s ease-in-out 0s 2";

    // Animations CSS
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes iaBlink {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.15); opacity: 0.5; }
        100% { transform: scale(1); opacity: 1; }
      }

      @keyframes starSpin {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.3); }
        100% { transform: rotate(360deg) scale(1); }
      }

      #ia-star {
        display: inline-block;
        animation: starSpin 1.2s ease-in-out 0s 2;
      }
    `;
    document.head.appendChild(style);

    // Hover
    btn.onmouseenter = () => {
      btn.style.transform = "scale(1.10)";
    };
    btn.onmouseleave = () => {
      btn.style.transform = "scale(1)";
    };

    // Action
    btn.onclick = toggleAIChatPanel;

    document.body.appendChild(btn);
  }

  // Injection
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

  // Polling
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
