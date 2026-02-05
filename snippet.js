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
    iframe.style.background = "#d9ecff"; 
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

  // Position
  btn.style.position = "fixed";
  btn.style.bottom = "25px";
  btn.style.right = "25px";

  // Taille plus grande
  btn.style.width = "85px";
  btn.style.height = "85px";

  // Couleur bleu foncé
  btn.style.background = "#0a2a66"; // <<< BLEU FONCÉ
  btn.style.color = "white";

  // Style général
  btn.style.borderRadius = "50%";
  btn.style.display = "flex";
  btn.style.alignItems = "center";
  btn.style.justifyContent = "center";
  btn.style.cursor = "pointer";
  btn.style.zIndex = "1000000";
  btn.style.fontSize = "30px";
  btn.style.fontWeight = "bold";
  btn.style.boxShadow = "0 6px 18px rgba(0,0,0,0.25)";
  btn.style.userSelect = "none";
  btn.style.transition = "transform 0.15s ease";

  // Animation de clignotement au démarrage
  btn.style.animation = "iaBlink 1s ease-in-out 0s 4";

  // Ajout de l’animation CSS
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes iaBlink {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.15); opacity: 0.5; }
      100% { transform: scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  // Effet hover
  btn.onmouseenter = () => {
    btn.style.transform = "scale(1.08)";
  };
  btn.onmouseleave = () => {
    btn.style.transform = "scale(1)";
  };

  // Action : ouvrir/fermer le panneau IA
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
