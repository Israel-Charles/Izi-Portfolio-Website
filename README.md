# Izi Portfolio Website

This portfolio website is hosted on a custom home server built from an old computer. I used a Linux OS (Ubuntu 24.04) to repurpose the machine, configured the network to allow incoming traffic, and leveraged technologies like Node.js, Express, and PM2 to ensure smooth backend operations. The frontend/design was done using WordPress for ease and flexibility, then converted to a static site using the Simply Static plugin. Cloudflare handles DNS for enhanced security and performance, while UFW manages the firewall.

The server configuration and the static pages to deliver are in this repo. Changes made to this repo automatically update the website through a GitHub Webhook and a Node.js/Express route that listens for incoming webhook POST requests from GitHub.

## Technology Description

In setting up my personal portfolio website on a repurposed home server, I integrated several technologies, each serving a specific function:

1. **Ubuntu 24.04 Linux Operating System (OS)**: I installed a Linux distribution on the old computer to provide a stable and secure foundation for the server environment. Linux is renowned for its reliability and efficiency, making it ideal for server operations.

2. **Node.js and Express**: Node.js is a JavaScript runtime that enables server-side execution of JavaScript code. Express is a web application framework for Node.js. Together, they handle HTTP requests and responses, serving the website's content to users.

3. **PM2**: PM2 is a process manager for Node.js applications. It allows for running the Node.js server as a service, ensuring continuous operation by automatically restarting the application in case of failures and managing system reboots.

4. **UFW (Uncomplicated Firewall)**: UFW is a firewall configuration tool for Linux. It is used to secure the server by controlling incoming and outgoing network traffic, allowing only necessary ports (such as 80 for HTTP and 443 for HTTPS) to be accessible.

5. **Cloudflare**: Cloudflare provides DNS (Domain Name System) services. By configuring my domain's DNS through Cloudflare, I ensure that users can reach my website using a human-readable address, ex: [israelcharles.com](https://israelcharles.com/). Additionally, Cloudflare offers benefits like SSL/TLS encryption and caching to enhance security and performance.

6. **WordPress with Simply Static Plugin**: WordPress is a content management system (CMS) that simplifies website creation and management. I used it to design and organize my website's content. The Simply Static plugin allows for exporting the dynamic WordPress site as static HTML files, which are then served by the Node.js server. This approach improves site performance and security by reducing server load.

## Setup Instructions

Below are the configurations, and processes I followed to get the site up and running.

### Requirements

- Old computer or server
- Linux OS (Ubuntu/Debian recommended)
- Home Wi-Fi router with port forwarding capabilities
- Internet connection with a static or dynamic DNS setup (Cloudflare recommended)
  
### Steps to set up Server and Website

#### 1. **Linux OS Installation**

- Install a lightweight Linux distribution (e.g., Ubuntu Server) on the old computer.
- Ensure the machine is connected to your local network.

#### 2. **Configure Home Wi-Fi and Network**

- Access your home router’s admin panel.
- Set up port forwarding to route traffic on port 80 for HTTP and port 443 for HTTPS to the internal IP address of the home server through port 3000 (if you are using the default configuration).
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
     sudo ufw allow 3000/tcp
     sudo ufw enable
     ```

#### 5. **PM2 Setup**

- Install PM2 to keep the Node.js server running in the background:

     ```bash
     sudo npm install pm2 -g
     pm2 start bin/www
     pm2 startup
     # Copy the command it gives you and run it
     pm2 save
     ```

#### 6. **Website Design with WordPress**

- Install WordPress locally or on a separate instance for easy content creation.
- Use the **Simply Static** plugin to export the site into static files. (You might need to go on the `Simply Static` plugin settings and set `Replacing URLS` to `Offline Usage` and toggle `Force URL replacements`.) 
- Copy the static files into your Express server’s `public` directory (Note that I have renamed my `public` folder to `Frontend`).

> If the **Simply Static** plugin does not work as expected, you can use the terminal/command line interface and use the `wget` command to download a static version of the file.
>
> Example command is as follow (running on mac):
> ```
> wget --mirror --convert-links --adjust-extension --page-requisites --no-parent http://israel-charles.local/ -P ~/Desktop/static-site
> ```
>
> It downloads a **full copy** of `http://israel-charles.local/` (HTML + CSS + JS + images), and saves it to `~/Desktop/static-site`.
>
>| Option                     | Meaning                                                                                                |
>| -------------------------- | ------------------------------------------------------------------------------------------------------ |
>| `--mirror`                 | Enables recursive download, timestamping, and infinite depth — like "make a full mirror of this site." |
>| `--convert-links`          | After downloading, rewrite HTML links to point to local files (so you can browse offline).             |
>| `--adjust-extension`       | Save files with proper extensions (e.g. `.html`, `.css`, `.js`).                                       |
>| `--page-requisites`        | Download all necessary resources: CSS, JS, images, fonts, etc.                                         |
>| `--no-parent`              | Do not follow links to parent directories — stay within `http://israel-charles.local/`.                |
>| `-P ~/Desktop/static-site` | Set the **output directory** — this will save everything to `~/Desktop/static-site`.                   |


#### 7. **Cloudflare DNS Setup**

- Register a domain name (or use an existing one).
- Point the domain to Cloudflare and configure DNS records to point to your home server’s public IP.
- Set up SSL/TLS for security (optional but recommended).

#### 8. **Testing & Deployment**

- Ensure your website is accessible via the domain.

### Steps to set up Automatic Update via Github Hooks and a Script

The steps below are to automatically update your website when changes are made to the static pages (which are served from a GitHub repo) whenever changes are pushed to that repository.

#### 1. **Set Up a Webhook in Your GitHub Repository**

First, you’ll need to create a webhook in your GitHub repository that will notify your server whenever there’s a push to the repository.

##### Steps:
1. **Go to your GitHub repository** and click on **Settings** > **Webhooks** > **Add webhook**.
2. **Fill in the webhook details**:
   - **Payload URL**: This is the URL that will receive the webhook request. For example, if your server’s public IP address is `https://israel.com`, your webhook URL could be something like:
     ```
     https://israel.com/webhook
     ```
     This URL will be where GitHub sends POST requests when something is pushed to the repo.
   - **Content type**: Set this to `application/json`.
   - **Which events would you like to trigger this webhook?**: Select **Just the push event**.
3. **Save the webhook**. GitHub will now send a POST request to your server every time a push occurs.

#### 2. **Create a Webhook Listener on Your Server**

Next, you’ll need to set up a **Node.js/Express route** that listens for incoming webhook POST requests from GitHub. When a push is detected, the webhook handler will trigger a script to `git pull` the latest changes into your local server.

##### Steps:
1. **Set up the webhook route in your Express app**:

   Add the following route to the file that handles your routing. For the default setup mentioned in the instructions above, the file is in `routes/index.js`. This route script will handle the incoming POST requests from GitHub:

   ```js
   const { exec } = require('child_process');  // We'll use this to run git pull

   // Webhook listener route
   app.post('/webhook', (req, res) => {
       console.log('Webhook received!');
       // Optionally, check the payload to ensure it's from the right repo
       // if (req.body.repository.full_name === 'your-username/your-repo-name') {

       // Run git pull on the server when a push occurs
       exec('cd /path/to/your/static-pages-repo && git pull origin main', (err, stdout, stderr) => {
           if (err) {
               console.error('Error during git pull:', err);
               return res.status(500).send('Internal Server Error');
           }
           console.log('Git pull output:', stdout);
           res.status(200).send('Webhook processed');
       });
   });
   ```

2. **Test and Verify the GitHub webhook route**:
   - Your webhook listener route is `/webhook` (in this case, `https://israelcharles.com/webhook`).
   - **Push a change** to your GitHub repository.
   - **Monitor the server logs** or run `curl http://your-server-ip/webhook` to manually test if the webhook is being triggered.
   - The `git pull` command should now run, updating your local static files with the latest push from GitHub.

#### 3. **Security Considerations (Optional)**

To make sure that only GitHub can trigger this webhook (and not arbitrary users), you can verify the payload in the Express route by checking the webhook signature GitHub sends:

- In the **Webhook Settings** in GitHub, enable the **secret**. GitHub will include this secret as a header (`X-Hub-Signature-256`) in the webhook request.
- On your server, you can use this secret to verify that the request is coming from GitHub.

Here's an example of how you can validate the webhook in your Express app:

```js
const crypto = require('crypto');

// Set your webhook secret here (the same secret you set in GitHub)
const secret = 'your-webhook-secret';

// Middleware to verify GitHub webhook signature
app.post('/webhook', (req, res) => {
    const sig = req.get('X-Hub-Signature-256');
    const payload = JSON.stringify(req.body);

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const calculatedSignature = 'sha256=' + hmac.digest('hex');

    if (sig !== calculatedSignature) {
        return res.status(403).send('Forbidden');
    }

    // Continue with your git pull logic here...
});
```

#### Summary of Automatic Deployment:
1. **GitHub Webhook**: Created a webhook in your GitHub repository that triggers whenever a push is made.
2. **Webhook Listener**: Set up an Express route to handle webhook requests.
3. **Security**: Optionally secured the webhook with a secret.
4. **Testing**: Tested the setup by pushing to the repository and confirming that changes were pulled onto your server.
