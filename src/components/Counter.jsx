
import React, { useState, useEffect } from 'react';

export default function Counter() {
  // 1. Initialisation du compteur depuis localStorage
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('mon_compteur_valeur');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  // 2. Pas d'incrémentation
  const [step, setStep] = useState(1);

  // 3. Messages et nombre total de clics
  const [message, setMessage] = useState('Aucun clic pour le moment');
  const [totalClics, setTotalClics] = useState(0);

  // 4. Restauration de l'historique
  const [historique, setHistorique] = useState(() => {
    const sauvegarde = localStorage.getItem('mon_compteur_historique');
    return sauvegarde !== null ? JSON.parse(sauvegarde) : [];
  });

  // 5. État des alertes
  const [alerte, setAlerte] = useState('');

  // EFFET 1 : Synchroniser le titre de l'onglet
  useEffect(() => {
    document.title = 'Compteur : ' + count;
  }, [count]);

  // EFFET 2 : Sauvegarder le compteur
  useEffect(() => {
    localStorage.setItem('mon_compteur_valeur', count.toString());
  }, [count]);

  // EFFET 3 : Sauvegarder l'historique
  useEffect(() => {
    localStorage.setItem(
      'mon_compteur_historique',
      JSON.stringify(historique)
    );
  }, [historique]);

  // Gestionnaire d'incrémentation
  const handleIncrement = () => {
    if (count + step > 50) {
      setAlerte('Seuil maximal de 50 atteint !');
      return;
    }

    setAlerte('');
    setCount((prev) => prev + step);
    setMessage('Ajout de ' + step);
    setTotalClics((prev) => prev + 1);
    setHistorique((prev) => [...prev, '+' + step]);
  };

  // Gestionnaire de décrémentation
  const handleDecrement = () => {
    if (count - step < -50) {
      setAlerte('Seuil minimal de -50 atteint !');
      return;
    }

    setAlerte('');
    setCount((prev) => prev - step);
    setMessage('Retrait de ' + step);
    setTotalClics((prev) => prev + 1);
    setHistorique((prev) => [...prev, '-' + step]);
  };

  // Gestionnaire de réinitialisation
  const handleReset = () => {
    setCount(0);
    setMessage('Remise à zéro');
    setTotalClics((prev) => prev + 1);
    setHistorique([]);
    setAlerte('');
  };

  // EFFET 4 : Contrôle du compteur au clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        handleIncrement();
      }

      if (e.key === 'ArrowDown') {
        handleDecrement();
      }
    };

    // Ajouter l'écouteur d'événement
    window.addEventListener('keydown', handleKeyDown);

    // Nettoyage : supprimer l'écouteur
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [count, step]);

  // Style dynamique selon le signe du compteur
  const getStyleClass = () => {
    if (count > 0) return 'counter-display positive';
    if (count < 0) return 'counter-display negative';
    return 'counter-display zero';
  };

  return (
    <div className="counter-card">
      <div className={getStyleClass()}>{count}</div>

      <div className="btn-group">
        <button className="btn btn-dec" onClick={handleDecrement}>
          -{step}
        </button>

        <button className="btn btn-reset" onClick={handleReset}>
          Reset
        </button>

        <button className="btn btn-inc" onClick={handleIncrement}>
          +{step}
        </button>
      </div>

      {/* Message d'alerte */}
      {alerte && (
        <p style={{ color: 'red', fontWeight: 'bold', marginTop: '10px' }}>
          ⚠️ {alerte}
        </p>
      )}

      <div className="step-control">
        <label htmlFor="step-select">Pas d'incrémentation :</label>

        <select
          id="step-select"
          value={step}
          onChange={(e) => setStep(parseInt(e.target.value, 10))}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="5">5</option>
          <option value="10">10</option>
        </select>
      </div>

      <div
        style={{
          marginTop: '20px',
          textAlign: 'left',
          background: '#f8fafc',
          padding: '14px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          fontSize: '0.9rem'
        }}
      >
        <p style={{ marginBottom: '6px' }}>
          📢 <strong>Dernière action :</strong> {message}
        </p>

        <p style={{ marginBottom: '6px' }}>
          🔢 <strong>Nombre total de clics :</strong> {totalClics}
        </p>

        {historique.length > 0 && (
          <p>
            📜 <strong>Historique simple :</strong> {historique.join(', ')}
          </p>
        )}
      </div>

      {/* Indication des raccourcis clavier */}
      <p style={{ marginTop: '15px', fontSize: '0.85rem' }}>
        ⌨️ Utilisez ↑ pour incrémenter et ↓ pour décrémenter.
      </p>
    </div>
  );
}
