import React, { useState, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext.jsx';

export default function TelaLogin() {
  const { senhaConfigurada, verificarSenha, definirSenha } = useApp();

  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [modo, setModo] = useState(senhaConfigurada ? 'entrar' : 'criar');

  const validarSenha = useCallback(() => {
    if (!senha.trim()) {
      setErro('Digite uma senha.');
      return false;
    }
    if (senha.length < 4) {
      setErro('A senha deve ter pelo menos 4 caracteres.');
      return false;
    }
    if (modo === 'criar' && senha !== confirmarSenha) {
      setErro('As senhas nao coincidem.');
      return false;
    }
    return true;
  }, [senha, confirmarSenha, modo]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setErro('');

    if (!validarSenha()) return;

    if (modo === 'criar') {
      definirSenha(senha.trim());
    } else {
      const ok = verificarSenha(senha.trim());
      if (!ok) {
        setErro('Senha incorreta.');
      }
    }
  }, [senha, modo, validarSenha, definirSenha, verificarSenha]);

  const toggleModo = useCallback(() => {
    setModo(prev => (prev === 'entrar' ? 'criar' : 'entrar'));
    setErro('');
    setSenha('');
    setConfirmarSenha('');
  }, []);

  const titulo = modo === 'criar' ? 'Crie sua senha' : 'Entrar no Mapa Culinario';
  const subtitulo = modo === 'criar'
    ? 'Primeiro acesso? Defina uma senha para proteger seus dados.'
    : 'Digite sua senha para continuar.';
  const botaoLabel = modo === 'criar' ? 'Criar senha' : 'Entrar';

  return (
    <div className="login-container">
      <div className="login-card fade-in">
        <div className="login-brand">
          <span className="login-icon">&#127860;</span>
          <h2 className="login-title">Mapa Culinario</h2>
        </div>

        <p className="login-subtitle">{subtitulo}</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="senha" className="login-label">
              Senha
            </label>
            <div className="login-input-wrap">
              <input
                id="senha"
                type={mostrarSenha ? 'text' : 'password'}
                className="input"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                autoFocus
              />
              <button
                type="button"
                className="login-toggle-password"
                onClick={() => setMostrarSenha(v => !v)}
                title={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {mostrarSenha ? '&#128065;' : '&#128065;&#8416;'}
              </button>
            </div>
          </div>

          {modo === 'criar' && (
            <div className="login-field">
              <label htmlFor="confirmarSenha" className="login-label">
                Confirmar senha
              </label>
              <input
                id="confirmarSenha"
                type={mostrarSenha ? 'text' : 'password'}
                className="input"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Repita a senha"
                autoComplete="new-password"
              />
            </div>
          )}

          {erro && (
            <div className="login-erro">
              <span className="login-erro-icon">&#9888;</span>
              <span>{erro}</span>
            </div>
          )}

          <button type="submit" className="btn login-submit">
            {botaoLabel}
          </button>
        </form>

        {senhaConfigurada && (
          <div className="login-footer">
            {modo === 'entrar' ? (
              <p>
                Primeiro acesso?{' '}
                <button type="button" className="login-link" onClick={toggleModo}>
                  Criar nova senha
                </button>
              </p>
            ) : (
              <p>
                Ja tem senha?{' '}
                <button type="button" className="login-link" onClick={toggleModo}>
                  Entrar
                </button>
              </p>
            )}
          </div>
        )}

        <p className="login-hint">
          Seus dados sao salvos localmente no navegador. Opcionalmente, sincronize com o Google Drive.
        </p>
      </div>

      <style>{`
        .login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 16px;
          background: var(--bg);
        }

        .login-card {
          width: 100%;
          max-width: 380px;
          background: var(--bg-card);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: 32px 24px;
          text-align: center;
        }

        .login-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .login-icon {
          font-size: 48px;
          line-height: 1;
        }

        .login-title {
          font-size: 22px;
          font-weight: 600;
          color: var(--text);
          margin: 0;
          letter-spacing: -0.3px;
        }

        .login-subtitle {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 12px 0 20px;
          line-height: 1.5;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          text-align: left;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .login-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .login-input-wrap {
          position: relative;
        }

        .login-input-wrap .input {
          padding-right: 44px;
        }

        .login-toggle-password {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 16px;
          cursor: pointer;
          color: var(--text-secondary);
          padding: 4px 6px;
          border-radius: 4px;
          transition: background 0.2s;
          line-height: 1;
        }

        .login-toggle-password:hover {
          background: var(--bg);
        }

        .login-erro {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: rgba(201, 123, 123, 0.1);
          color: var(--danger);
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 500;
        }

        .login-erro-icon {
          font-size: 16px;
          flex-shrink: 0;
        }

        .login-submit {
          width: 100%;
          margin-top: 4px;
          padding: 14px 20px;
          font-size: 15px;
          font-weight: 600;
        }

        .login-footer {
          margin-top: 18px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .login-link {
          background: none;
          border: none;
          color: var(--accent);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
          font-family: var(--font);
        }

        .login-link:hover {
          color: var(--text);
        }

        .login-hint {
          margin-top: 20px;
          font-size: 11px;
          color: var(--text-secondary);
          opacity: 0.8;
          line-height: 1.5;
        }

        @media (min-width: 640px) {
          .login-card {
            padding: 40px 36px;
          }

          .login-title {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}
