import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

const TerminalComponent = () => {
  const terminalRef = useRef(null);

  useEffect(() => {
    const terminal = new Terminal({
      cursorBlink: true,
      rows: 20,
      theme: {
        background: '#000000',
        foreground: '#00FF00'
      }
    });
    terminal.open(terminalRef.current);
    terminal.writeln('Добро пожаловать в терминал!');
    terminal.writeln('Введите help для списка команд.');

    terminal.onKey(e => {
      const char = e.key;
      terminal.write(char);
    });

    return () => terminal.dispose();
  }, []);

  return (
    <div
      ref={terminalRef}
      style={{
        height: '100%',
        width: '100%',
        border: '1px solid #00FF00',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  );
};

export default TerminalComponent;
