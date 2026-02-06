import React, { useState } from 'react';
import { Button, TextField, FormControlLabel, Switch } from '@material-ui/core';

const ReplyGenerator = ({ onReplySubmit }) => {
  const [prompt, setPrompt] = useState('');
  const [includeStop, setIncludeStop] = useState(false);
  const [generatedReply, setGeneratedReply] = useState('');

  const generateReply = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/generate-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          includeStop,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate reply');
      }
      const data = await response.json();
      setGeneratedReply(data.reply);
      onReplySubmit(data.reply); // Pass the generated reply to the parent component
    } catch (error) {
      console.error('Error generating reply:', error);
    }
  };

  return (
    <div>
      <TextField
        label="Prompt"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <FormControlLabel
        control={<Switch checked={includeStop} onChange={() => setIncludeStop(!includeStop)} />}
        label="Include Stop"
      />
      <Button variant="contained" color="primary" onClick={generateReply}>
        Generate Reply 
      </Button>
      <div>
        <h3>Generated Reply:</h3>
        <p>{generatedReply}</p>
      </div>
    </div>
  );
};

export default ReplyGenerator;
