const vscode = require("vscode");
const axios = require("axios");

// Define the API endpoint URL
const apiUrl = 'https://api.fireworks.ai/inference/v1/chat/completions';

// Define the bearer token (use environment variables in production)
const bearerToken = 'YOUR-API-KEY-HERE';

// Create a reusable Axios instance with default headers
const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Authorization': `Bearer ${bearerToken}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

async function enhanceCode(editor) {
  try {
    const text = editor.document.getText(editor.selection);
    const body = {
      temperature: 1,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      n: 1,
      stop: null,
      response_format: {
        type: 'text'
      },
      stream: false,
      model: 'accounts/fireworks/models/llama-v2-70b-chat',
      messages: [
        {
          role: 'user',
          content: 'Act as an experienced senior software engineer. Optimize the incoming code snippet to fix any bugs, errors, vulnerabilities, or potential issues. Handle all edge cases. Provide the updated code with explanations as comments. Your response should only include valid python code with explanation as python code comments. any english sentences should be preceeded by #.\n\nCode:\n' + text
        }
      ]
    };

    const response = await apiClient.post('', body);
    const enhancedCode = response.data.choices[0].message.content;

    editor.edit(editBuilder => {
      editBuilder.replace(editor.selection, enhancedCode);
    });
  } catch (error) {
    console.error('Error:', error);
    vscode.window.showErrorMessage('Error: ' + error.message);
  }
}

async function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.enhanceCode', async () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        await enhanceCode(editor);
      }
    })
  );
}

exports.activate = activate;
exports.deactivate = () => {};
