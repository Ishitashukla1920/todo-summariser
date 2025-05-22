import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { supabase } from './services/supabaseClient.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// GET /todos - fetch all todos
app.get('/todos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('id, title, completed, created_at')
      .order('created_at', { ascending: true });
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching todos:', error.message);
    res.status(500).json({ message: 'Failed to fetch todos', error: error.message });
  }
});

// POST /todos - add a new todo
app.post('/todos', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Todo title is required' });

    const { data, error } = await supabase
      .from('todos')
      .insert([{ title, completed: false }])
      .select()
      .single();
    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Error adding todo:', error.message);
    res.status(500).json({ message: 'Failed to add todo', error: error.message });
  }
});

// PUT /todos/:id - update a todo (title or completed status)
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body; 

    const updateData = {};
    if (title !== undefined) { 
      updateData.title = title;
    }
    if (completed !== undefined) { 
      updateData.completed = completed;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No fields provided for update.' });
    }

    const { data, error } = await supabase
      .from('todos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single(); 
    
    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Todo not found.' });

    res.status(200).json(data);
  } catch (error) {
    console.error('Error updating todo:', error.message);
    res.status(500).json({ message: 'Failed to update todo', error: error.message });
  }
});


// DELETE /todos/:id - delete a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);
    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting todo:', error.message);
    res.status(500).json({ message: 'Failed to delete todo', error: error.message });
  }
});

// POST /summarize - summarize pending todos and send to Slack
app.post('/summarize', async (req, res) => {
  try {
    
    const { data: todos, error: fetchError } = await supabase
      .from('todos')
      .select('title')
      .eq('completed', false);
    if (fetchError) throw fetchError;

    const pending = todos.map((t, i) => `${i + 1}. ${t.title}`).join('\n');
    if (!pending) {
      return res.status(200).json({ message: 'No pending todos to summarize.' });
    }

    const prompt = `Summarize the following pending to-dos concisely and professionally:\n${pending}`;

    // call Gemini API
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) throw new Error('GEMINI_API_KEY is not set');

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;
    const payload = { contents: [{ role: 'user', parts: [{ text: prompt }] }] };

    const llmRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!llmRes.ok) throw new Error(`LLM error ${llmRes.status}`);
    const llmJson = await llmRes.json();
    const summary = llmJson.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary.';

    // post to Slack
    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    if (!slackUrl) throw new Error('SLACK_WEBHOOK_URL is not set');

    const slackRes = await fetch(slackUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: `*Todo Summary:*\n${summary}` }),
    });
    if (!slackRes.ok) throw new Error(`Slack error ${slackRes.status}`);

    res.status(200).json({ message: 'Summary sent to Slack', summary });
  } catch (error) {
    console.error('Error in summarize:', error.message);
    res.status(500).json({ message: 'Failed to summarize and send', error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
