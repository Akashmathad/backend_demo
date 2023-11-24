const express = require('express');
const app = express();
const { spawn } = require('child_process');
const fs = require('fs');

app.use(express.json());

const port = 5000;

app.post('/runJavaCode', (req, res) => {
  const userCode = req.body.code;

  // Validate and sanitize user's input (add your validation logic here)

  // Write the user's code to a Java file
  fs.writeFileSync('UserProgram.java', userCode);

  // Compile and run the user's code
  const javaPath = `${__dirname}/lib/java/bin`; // Update this with your path
  const javacCommand = 'javac';
  const javaCommand = 'java';

  // Compile
  const compileProcess = spawn(`${javaPath}/${javacCommand}`, [
    'UserProgram.java',
  ]);

  compileProcess.on('exit', (code) => {
    if (code === 0) {
      // Compilation was successful, now run the user's code
      const runProcess = spawn(`${javaPath}/${javaCommand}`, ['UserProgram']);

      let output = '';

      runProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      runProcess.stderr.on('data', (data) => {
        output += data.toString();
      });

      runProcess.on('exit', (runCode) => {
        console.log(`User Program exited with code ${runCode}`);

        // Clean up: Remove the generated Java file
        fs.unlinkSync('UserProgram.java');

        // Send the output back in the response
        res.status(200).json({ output });
      });
    } else {
      console.error('Compilation Error: Unable to compile user code.');

      // Clean up: Remove the generated Java file
      fs.unlinkSync('UserProgram.java');

      res.status(400).json({ error: 'Compilation Error' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
