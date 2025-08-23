import { GiphyFetch } from '@giphy/js-fetch-api'
import { Grid } from '@giphy/react-components'
import type { IGif } from '@giphy/js-types';
import { GIPHY_API_KEY } from '@constants/GiphyApi'
import { useCallback, useState, type SyntheticEvent } from 'react';
import '@styles/components-styles/MediaDialogBox.css';

const giphyApi = new GiphyFetch(GIPHY_API_KEY);

type Props = {
  onGifSelect: (url: string) => void;
  refer: React.RefObject<HTMLDivElement | null>;
};


export default function GiphyDialogBox({ onGifSelect, refer }: Props) {
    const [searchTerm, setSearchTerm] = useState('')

    const handleGifClick = useCallback((gif: IGif, e: SyntheticEvent) => {
        console.log('GIF clicked:', gif, e);
        e.preventDefault();   // stop link navigation
        e.stopPropagation();
        Object.defineProperty(e, 'defaultPrevented', { value: true, writable: false });
        onGifSelect(gif.images.original.url); // or use fixed_height.url if needed
    }, [onGifSelect]);
  
    const fetchGifs = (offset:number) => {
        if (searchTerm.trim()) {
            return giphyApi.search(searchTerm, { offset, limit: 10 })
        } else {
            return giphyApi.trending({ offset, limit: 10 })
        }
    }
    return (
        <div className='inputAndDialogContainer' ref={refer}>
            <input type="text"
                placeholder="Search GIFs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='dialogBoxSearchingInput'
            />
            <Grid 
                width={200}
                columns={3}
                gutter={6}
                fetchGifs={fetchGifs}
                key={searchTerm}
                onGifClick={handleGifClick}
                noLink 
            />
        </div>
    )
}