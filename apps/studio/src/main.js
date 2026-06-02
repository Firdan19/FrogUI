import '@frogui/ui-core';
import './theme/app.css';

const gatewayUrl = import.meta.env.VITE_GATEWAY_URL;

if (gatewayUrl) {
  document.querySelectorAll('[gateway-url]').forEach((element) => {
    element.setAttribute('gateway-url', gatewayUrl);
  });
}

