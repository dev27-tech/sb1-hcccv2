import React, { useState, useRef } from 'react';
import { Mic, MicOff, Wand2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import RichTextEditor from './RichTextEditor';

interface TaskInputProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export default function TaskInput({ value, onChange, onRemove }: TaskInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isCorrectingGrammar, setIsCorrectingGrammar] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const recognition = useRef<SpeechRecognition | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const startListening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    recognition.current = new webkitSpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.interimResults = true;

    recognition.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      onChange(transcript);
    };

    recognition.current.onerror = (event) => {
      console.error(event.error);
      toast.error('Error with speech recognition');
      stopListening(e);
    };

    recognition.current.start();
    setIsListening(true);
  };

  const stopListening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (recognition.current) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const correctGrammar = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsCorrectingGrammar(true);
    try {
      const response = await fetch('/api/correct-grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: value }),
      });
      
      if (!response.ok) throw new Error('Grammar correction failed');
      
      const { correctedText } = await response.json();
      onChange(correctedText);
      toast.success('Grammar corrected');
    } catch (error) {
      toast.error('Failed to correct grammar');
    } finally {
      setIsCorrectingGrammar(false);
    }
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onChange(e.target.value);
  };

  return (
    <>
      <div className="flex items-center space-x-2" onClick={() => inputRef.current?.focus()}>
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChange}
            onClick={handleInputClick}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none pr-24"
            placeholder="Enter task description"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setShowEditor(true)}
              className="p-1 rounded-full text-gray-400 hover:text-gray-500"
              title="Open rich text editor"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`p-1 rounded-full transition-colors ${
                isListening ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-500'
              }`}
              title={isListening ? 'Stop recording' : 'Start recording'}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={correctGrammar}
              disabled={isCorrectingGrammar || !value}
              className={`p-1 rounded-full transition-colors ${
                isCorrectingGrammar ? 'text-blue-500' : 'text-gray-400 hover:text-gray-500'
              } ${!value && 'opacity-50 cursor-not-allowed'}`}
              title="Correct grammar"
            >
              <Wand2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {showEditor && (
        <RichTextEditor
          initialContent={value}
          onSave={(content) => {
            onChange(content);
            setShowEditor(false);
          }}
          onClose={() => setShowEditor(false)}
        />
      )}
    </>
  );
}