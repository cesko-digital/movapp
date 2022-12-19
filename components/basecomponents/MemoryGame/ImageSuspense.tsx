import Image, {ImageProps} from "next/image";
import React, {useState} from 'react'
import styles from './ImageSuspense.module.css';

const ImageSuspense = (props: ImageProps) => {
  const [loading, setLoading] = useState(true)
  
  return (
    loading ? <Image onLoadingComplete={() => setLoading(false)} className={styles.hidden} {...props} /> : <Image {...props}/>
  )
}

export default ImageSuspense