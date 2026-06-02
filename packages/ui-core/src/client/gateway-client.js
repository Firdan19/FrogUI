export class GatewayClient {
  constructor({ gatewayUrl = '', jwtToken = '' } = {}) {
    this.gatewayUrl = gatewayUrl.replace(/\/$/, '');
    this.jwtToken = jwtToken;
  }

  async createCommand(command) {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.jwtToken) {
      headers['Authorization'] = `Bearer ${this.jwtToken}`;
    }

    const response = await fetch(`${this.gatewayUrl}/api/command`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ command }),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Gateway request failed with ${response.status}`);
    }

    return response.json();
  }
}

