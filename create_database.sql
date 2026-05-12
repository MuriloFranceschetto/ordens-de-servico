-- Criação do banco de dados
CREATE DATABASE mecafran
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'pt_BR.UTF-8'
    LC_CTYPE = 'pt_BR.UTF-8'
    TEMPLATE = template0;

-- Garantir permissões (opcional)
GRANT ALL PRIVILEGES ON DATABASE mecafran TO postgres;