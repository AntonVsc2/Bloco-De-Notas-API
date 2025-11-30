
const express = require('express');
require('dotenv').config(); 
console.log("URL lida pelo dotenv:", process.env.SUPABASE_URL);
console.log("Chave lida pelo dotenv:", process.env.SUPABASE_KEY);
const { createClient } = require('@supabase/supabase-js');


const app = express();
app.use(express.json()); 
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


app.get('/notas', async (req, res) => {
  const { data, error } = await supabase
    .from('notas') 
    .select('*');

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json(data);
});


app.get('/notas/:id', async (req, res) => {
  const { id } = req.params; 

  const { data, error } = await supabase
    .from('notas')
    .select('*')
    .eq('id', id) 
    .single(); 

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: 'Nota não encontrada' });
  }

  return res.status(200).json(data);
});


app.post('/notas', async (req, res) => {
  const { titulo, conteudo } = req.body; 


  if (!titulo) {
    return res.status(400).json({ error: 'O campo "titulo" é obrigatório.' });
  }

  const { data, error } = await supabase
    .from('notas')
    .insert([{ titulo, conteudo }])
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(201).json(data); 
});


app.put('/notas/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, conteudo } = req.body;

  if (!titulo && !conteudo) {
    return res.status(400).json({ error: 'É preciso fornecer "titulo" ou "conteudo" para atualizar.' });
  }

  const { data, error } = await supabase
    .from('notas')
    .update({ titulo, conteudo })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }
    
  if (!data) {
    return res.status(404).json({ error: 'Nota não encontrada' });
  }

  return res.status(200).json(data);
});


app.delete('/notas/:id', async (req, res) => {
  const { id } = req.params;

  const { error, data } = await supabase
    .from('notas')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: 'Nota não encontrada' });
  }

  return res.status(204).send();
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
