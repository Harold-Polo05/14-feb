import React, { useState, useEffect } from 'react';
import {Heart,Stars,XCircle,CheckCircle2,Gift,Music,Coffee} from 'lucide-react';

function App() {
  // Estados del componente
  const [step, setStep] = useState(0); // Controla el paso actual en la lista de razones
  const [showProposal, setShowProposal] = useState(false); // Muestra la propuesta cuando es true
  const [answer, setAnswer] = useState<boolean | null>(null); // Almacena la respuesta del usuario (true = sí, false = no, null = sin responder)
  const [position, setPosition] = useState({ x: 50, y: 50 }); // Posición del botón "No" en porcentaje

  // Función para mover el botón "No" aleatoriamente cuando el cursor se acerca
  const moveNoButton = (
    cursorX: number,
    cursorY: number,
    buttonX: number,
    buttonY: number
  ) => {
    // Calcula la dirección opuesta al cursor
    const deltaX = buttonX - cursorX;
    const deltaY = buttonY - cursorY;
    const angle = Math.atan2(deltaY, deltaX);

    // Mueve el botón en una dirección aleatoria pero lejos del cursor
    const distance = 200; // Distancia máxima de escape
    const randomAngle = angle + ((Math.random() - 0.5) * Math.PI) / 2; // Añade algo de aleatoriedad al ángulo
    const newX = Math.min(
      Math.max(10, position.x + Math.cos(randomAngle) * distance),
      90
    ); // Limita el movimiento dentro de los bordes
    const newY = Math.min(
      Math.max(10, position.y + Math.sin(randomAngle) * distance),
      90
    );

    setPosition({ x: newX, y: newY }); // Actualiza la posición del botón
  };

  // Lista de razones para mostrar antes de la propuesta
  const reasons = [
    'Porque eres especial',
    'Porque me haces sonreír',
    'Porque contigo todo es mejor',
    'Porque iluminas mi día',
    'Porque eres única',
  ];

  // Efecto para avanzar automáticamente a través de las razones
  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < reasons.length && !showProposal) {
        setStep(step + 1); // Incrementa el paso después de 2 segundos
      }
    }, 2000);
    return () => clearTimeout(timer); // Limpia el temporizador al desmontar o reiniciar el efecto
  }, [step]);

  // Si el usuario responde "Sí", muestra una pantalla de celebración
  if (answer === true) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-pink-500 via-red-500 to-purple-500 flex items-center justify-center">
        <div className="text-center animate-bounce">
          <h1 className="text-6xl font-bold text-white mb-8">
            ¡Dijiste que siii! ❤️
          </h1>
          <div className="flex gap-4 justify-center">
            <Gift className="w-16 h-16 text-white" />
            <Heart className="w-16 h-16 text-white" />
            <Music className="w-16 h-16 text-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Muestra las razones antes de la propuesta */}
        {!showProposal ? (
          <div className="bg-white rounded-lg p-8 shadow-xl text-center">
            <Stars className="w-12 h-12 mx-auto mb-4 text-purple-500 animate-spin" />
            <div className="space-y-4">
              {reasons.slice(0, step + 1).map((reason, index) => (
                <p
                  key={index}
                  className="text-lg font-medium text-gray-800 animate-fade-in"
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  {reason} {/* Muestra cada razón con un retraso animado */}
                </p>
              ))}
            </div>
            {step === reasons.length && (
              <button
                onClick={() => setShowProposal(true)} // Cambia a la pantalla de propuesta
                className="mt-6 px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
              >
                Continuar ❤️
              </button>
            )}
          </div>
        ) : (
          // Pantalla de propuesta
          <div className="bg-white rounded-lg p-8 shadow-xl text-center">
            <img
              src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
              alt="Romantic hearts"
              className="w-full h-48 object-cover rounded-lg mb-6"
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              ¿Quieres ser mi San Valentín? {/* Pregunta principal */}
            </h1>
            <div
              className="relative h-40"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left; // Posición X del cursor relativa al contenedor
                const y = e.clientY - rect.top; // Posición Y del cursor relativa al contenedor
                const buttonRect = document
                  .getElementById('no-button')
                  ?.getBoundingClientRect();
                if (buttonRect) {
                  const buttonCenterX =
                    buttonRect.left + buttonRect.width / 2 - rect.left; // Centro X del botón "No"
                  const buttonCenterY =
                    buttonRect.top + buttonRect.height / 2 - rect.top; // Centro Y del botón "No"
                  const distance = Math.sqrt(
                    Math.pow(x - buttonCenterX, 2) +
                      Math.pow(y - buttonCenterY, 2)
                  ); // Calcula la distancia entre el cursor y el botón "No"
                  if (distance < 150) {
                    // Si el cursor está cerca, mueve el botón
                    moveNoButton(x, y, buttonCenterX, buttonCenterY);
                  }
                }
              }}
            >
              {/* Botón "Sí" */}
              <button
                onClick={() => setAnswer(true)} // Establece la respuesta como "Sí"
                className="absolute left-1/2 transform -translate-x-1/2 px-8 py-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex items-center gap-2 text-lg font-semibold shadow-lg hover:scale-110 transition-transform duration-200"
              >
                <CheckCircle2 className="w-6 h-6" />
                ¡Sí!
              </button>
              {/* Botón "No" */}
              <button
                id="no-button"
                style={{
                  position: 'absolute',
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: 'translate(-50%, -50%)',
                  transition: 'all 0.15s ease-out', // Transición suave para el movimiento
                }}
                className="px-8 py-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center gap-2 text-lg font-semibold cursor-none"
              >
                <XCircle className="w-6 h-6" />
                No
              </button>
            </div>
            <div className="mt-8 flex justify-center items-center gap-2">
              <Coffee className="w-5 h-5 text-purple-500" />
              <span className="text-gray-600">
                ¿Me concederías este honor?
              </span>{' '}
              {/* Texto adicional */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
