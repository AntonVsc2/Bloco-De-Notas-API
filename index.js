const express = require('express');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

app.post('/auth/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(201).json({ user: data.user });
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  return res.status(200).json(data);
});

app.get('/notas', async (req, res) => {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from('notas')
    .select('*');

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json(data);
});

app.post('/notas', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Acesso não autorizado. Token não fornecido.' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }

  const { titulo, conteudo } = req.body;
  if (!titulo) {
    return res.status(400).json({ error: 'O campo "titulo" é obrigatório.' });
  }

  const { data: nota, error: insertError } = await supabase
    .from('notas')
    .insert([{ titulo, conteudo, user_id: user.id }])
    .select()
    .single();

  if (insertError) {
    return res.status(400).json({ error: insertError.message });
  }

  return res.status(201).json(nota);
});

app.put('/notas/:id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Acesso não autorizado. Token não fornecido.' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

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
    return res.status(404).json({ error: 'Nota não encontrada ou você não tem permissão para editá-la.' });
  }

  return res.status(200).json(data);
});

app.delete('/notas/:id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Acesso não autorizado. Token não fornecido.' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

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
    return res.status(404).json({ error: 'Nota não encontrada ou você não tem permissão para deletá-la.' });
  }

  return res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
