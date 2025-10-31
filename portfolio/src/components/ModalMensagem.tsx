import { useState } from 'react';
import { FaTimes, FaComment, FaEye, FaEyeSlash, FaUserSecret } from 'react-icons/fa';
import { apiService } from '../service/apiService';
import '../assets/styles/ModalMensagem.css';

interface ModalMensagemProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalMensagem: React.FC<ModalMensagemProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    mensagem: '',
    privada: true
  });
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      mensagem: e.target.value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      privada: e.target.checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.mensagem.trim()) {
      setErro('Escreva uma mensagem antes de enviar!');
      return;
    }

    if (formData.mensagem.trim().length < 5) {
      setErro('A mensagem precisa ter pelo menos 5 caracteres!');
      return;
    }

    setEnviando(true);
    setErro('');

    try {
      await apiService.enviarMensagem({
        mensagem: formData.mensagem.trim(),
        privada: formData.privada
      });

      setSucesso(true);
      setFormData({ mensagem: '', privada: false });
      
      // Fecha o modal após 2 segundos
      setTimeout(() => {
        setSucesso(false);
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setErro('Erro ao enviar mensagem. Tente novamente!');
    } finally {
      setEnviando(false);
    }
  };

  const handleClose = () => {
    setFormData({ mensagem: '', privada: false });
    setErro('');
    setSucesso(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>💌 Mensagem Anônima</h2>
          <button className="modal-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        {sucesso ? (
          <div className="modal-success">
            <div className="success-icon">✅</div>
            <h3>Mensagem enviada com sucesso!</h3>
            <small>Sua mensagem é {formData.privada ? 'privada 🔒' : 'pública 🌟'}</small>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="anonimo-info">
              <FaUserSecret className="anonimo-icon" />
              <p>Sua mensagem é totalmente anônima</p>
            </div>

            <div className="form-group">
              <label htmlFor="mensagem">
                <FaComment className="input-icon" />
                Sua Mensagem *
              </label>
              <textarea
                id="mensagem"
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                placeholder="Escreva sua mensagem especial... (mínimo 5 caracteres)"
                rows={5}
                required
                disabled={enviando}
                maxLength={500}
              />
              <div className="char-count">
                {formData.mensagem.length}/500 caracteres
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="privada"
                  checked={formData.privada}
                  onChange={handleCheckboxChange}
                  disabled={enviando}
                />
                <span className="checkmark"></span>
                <div className="checkbox-text">
                  {formData.privada ? <FaEyeSlash /> : <FaEye />}
                  <div>
                    <strong>
                      {formData.privada ? 'Mensagem Privada' : 'Mensagem Pública'}
                    </strong>
                    <small>
                      {formData.privada 
                        ? 'Apenas eu verei esta mensagem 🔒' 
                        : 'Todos poderão ver esta mensagem 🌟'
                      }
                    </small>
                  </div>
                </div>
              </label>
            </div>

            {erro && <div className="form-error">{erro}</div>}

            <div className="form-actions">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-cancel"
                disabled={enviando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-submit"
                disabled={enviando || formData.mensagem.trim().length < 5}
              >
                {enviando ? 'Enviando... ✨' : 'Enviar Mensagem Anônima 💖'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ModalMensagem;