var express = require('express');
var router = express.Router();

const { exec } = require('child_process');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/webhook', (req, res) => {
  console.log('Webhook received!');
  // Optionally, check the payload to ensure it's from the right repo
  // if (req.body.repository.full_name === 'your-username/your-repo-name') {

  // Run git pull on the server when a push occurs
  exec('cd /home/israel-userver/gitClones/Izi-Portfolio-Website && git pull origin main', (err, stdout, stderr) => {
      if (err) {
          console.log('Error during git pull:', err);
          return res.status(500).send('Internal Server Error');
      }
      console.log('Git pull output:', stdout);
      res.status(200).send('Webhook processed');
  });
});

module.exports = router;
