// import '../../global.css';
import React, { memo } from 'react'
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BaseLayout = ({children}) => {
  return (
    <SafeAreaView className="flex-1 a bg-white">
        <StatusBar/>
        {children}
    </SafeAreaView>
  )
}

export default memo(BaseLayout)
