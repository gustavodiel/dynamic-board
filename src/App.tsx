import React, {useCallback, useMemo, useState} from 'react';
import { BodyWidget } from './diagram/components/BodyWidget';
import { Application } from './diagram/Application';
import './App.css';

function App() {
  // const [app, setApp] = useState(new Application())
  const app = useMemo(() => new Application(), [])
  return <BodyWidget app={app} />;
}

export default App;
