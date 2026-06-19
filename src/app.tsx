import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { StoreProvider } from './store';
// 全局样式
import './app.scss';

function App(props) {
  useEffect(() => {
    console.log('[App] ScriptClub MiniApp initialized');
  }, []);

  useDidShow(() => {
    console.log('[App] App showed');
  });

  useDidHide(() => {
    console.log('[App] App hided');
  });

  return (
    <StoreProvider>
      {props.children}
    </StoreProvider>
  );
}

export default App;
