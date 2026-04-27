import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// read config
const configPath = resolve(__dirname, 'firebase-applet-config.json');
const configData = readFileSync(configPath, 'utf8');
const config = JSON.parse(configData);

const app = getApps().length === 0 ? initializeApp(config) : getApp();
const db = getFirestore(app);

async function run() {
  const snap = await getDocs(collection(db, 'products'));
  for (const productDoc of snap.docs) {
    let data = productDoc.data();
    let images = data.images;
    if (!images) continue;
    let changed = false;
    let newImages = images.map((img: string) => {
      if (img.includes('1526414963567-0c7ed0e6871a')) return 'https://picsum.photos/seed/p8/800/1000';
      if (img.includes('1556821840-0a25f18c2fc9')) return 'https://picsum.photos/seed/p10/800/1000';
      if (img.includes('1563280145-d85626c9f2b8')) return 'https://picsum.photos/seed/p11_2/800/1000';
      if (img.includes('1563280145-2bc5d3c8d17d')) return 'https://picsum.photos/seed/p11/800/1000';
      if (img.includes('1620799139834-6b8f844fb2b5')) return 'https://picsum.photos/seed/p3_2/800/1000';
      if (img.includes('1556821840-b63f27f6b216')) return 'https://picsum.photos/seed/p7/800/1000';
      if (img.includes('1556821840-02ba4bb0c4a4')) return 'https://picsum.photos/seed/p7_2/800/1000';
      return img;
    });
    for(let i=0; i<images.length; i++) {
        if(images[i] !== newImages[i]) changed = true;
    }
    if (changed) {
        await updateDoc(doc(db, 'products', productDoc.id), { images: newImages });
        console.log('Updated', productDoc.id);
    }
  }
  console.log('Migration complete');
}
run();
