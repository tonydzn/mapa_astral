-- ============================================================
--  ADMIN SETUP SCRIPT — Executar no Supabase SQL Editor
-- ============================================================

-- 1. Adicionar campo is_admin à tabela profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE NOT NULL;

-- 2. Criar o usuário admin no Supabase
-- ATENÇÃO: O usuário deve ser criado MANUALMENTE via:
--   Supabase Dashboard → Authentication → Users → Add User
--   Email:  admin_tony@mapaastral.com
--   Senha:  @Senha123456|_
--   Depois, copie o UUID gerado e use abaixo.

-- 3. Após criar o usuário no Auth, marcar como admin:
--    Substitua o email abaixo se necessário.
UPDATE profiles
SET is_admin = TRUE
WHERE email = 'admin_tony@mapaastral.com';

-- 4. (Opcional) Verificar que o campo foi criado corretamente:
SELECT id, email, is_admin, is_premium
FROM profiles
ORDER BY created_at DESC
LIMIT 20;
