# Izi Portfolio Website

This portfolio website is hosted on a custom home server built from an old computer. I used a Linux OS to repurpose the machine, configured the network to allow incoming traffic, and leveraged technologies like Node.js, Express, and PM2 to ensure smooth backend operations. The design was done using WordPress for ease and flexibility, then converted to a static site using the Simply Static plugin. Cloudflare handles DNS for enhanced security and performance, while UFW manages the firewall.

## Technology Description

In setting up my personal portfolio website on a repurposed home server, I integrated several technologies, each serving a specific function:

1. **Ubuntu 24.04 Linux Operating System (OS)**: I installed a Linux distribution on the old computer to provide a stable and secure foundation for the server environment. Linux is renowned for its reliability and efficiency, making it ideal for server operations.

2. **Node.js and Express**: Node.js is a JavaScript runtime that enables server-side execution of JavaScript code. Express is a web application framework for Node.js. Together, they handle HTTP requests and responses, serving the website's content to users.

3. **PM2**: PM2 is a process manager for Node.js applications. It allows for running the Node.js server as a service, ensuring continuous operation by automatically restarting the application in case of failures and managing system reboots.

4. **UFW (Uncomplicated Firewall)**: UFW is a firewall configuration tool for Linux. It is used to secure the server by controlling incoming and outgoing network traffic, allowing only necessary ports (such as 80 for HTTP and 443 for HTTPS) to be accessible.

5. **Cloudflare**: Cloudflare provides DNS (Domain Name System) services. By configuring my domain's DNS through Cloudflare, I ensure that users can reach my website using a human-readable address (israelcharles.com). Additionally, Cloudflare offers benefits like SSL/TLS encryption and caching to enhance security and performance.

6. **WordPress with Simply Static Plugin**: WordPress is a content management system (CMS) that simplifies website creation and management. I used it to design and organize my website's content. The Simply Static plugin allows for exporting the dynamic WordPress site as static HTML files, which are then served by the Node.js server. This approach improves site performance and security by reducing server load.

## Setup Instructions

Below are the configurations, and processes I followed to get the site up and running.

### Requirements

- Old computer or server
- Linux OS (Ubuntu/Debian recommended)
- Home Wi-Fi router with port forwarding capabilities
- Internet connection with a static or dynamic DNS setup (Cloudflare recommended)
  
### Steps

#### 1. **Linux OS Installation**

- Install a lightweight Linux distribution (e.g., Ubuntu Server) on the old computer.
- Ensure the machine is connected to your local network.

#### 2. **Configure Home Wi-Fi and Network**

- Access your home router’s admin panel.
- Set up port forwarding to route traffic on specific ports (e.g., port 80 for HTTP or port 443 for HTTPS) to the internal IP address of the home server.
- (Optional) For dynamic IPs, use Cloudflare’s free DNS service to create a dynamic DNS setup, so your website remains accessible even if your home IP changes.

#### 3. **Node.js and Express Setup**

- Install Node.js and NPM:

    ```bash
    sudo apt update
    sudo apt install nodejs npm
    ```

- Create an Express server to serve the static files:

    ```bash
    npx express-generator
    ```

- Install dependencies:

    ```bash
    npm install
    ```

#### 4. **Firewall Configuration**

- Install UFW and allow traffic on required ports (e.g., HTTP, HTTPS):

     ```bash
     sudo apt install ufw
     sudo ufw allow 80/tcp
     sudo ufw allow 443/tcp
     sudo ufw enable
     ```

#### 5. **PM2 Setup**

- Install PM2 to keep the Node.js server running in the background:

     ```bash
     sudo npm install pm2 -g
     pm2 start app.js
     pm2 startup
     pm2 save
     ```

#### 6. **Website Design with WordPress**

- Install WordPress locally or on a separate instance for easy content creation.
- Use the **Simply Static** plugin to export the site into static files.
- Copy the static files into your Express server’s `public` directory.

#### 7. **Cloudflare DNS Setup**

- Register a domain name (or use an existing one).
- Point the domain to Cloudflare and configure DNS records to point to your home server’s public IP.
- Set up SSL/TLS for security (optional but recommended).

#### 8. **Testing & Deployment**

- Ensure your website is accessible via the domain.