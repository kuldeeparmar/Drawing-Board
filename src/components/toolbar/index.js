import styles from './index.module.css'
import { COLORS, MENU_ITEMS } from '@/constant';
import { useSelector,useDispatch } from 'react-redux';
import { changeColor,changeSize } from '@/slice/toolboxSlice';
import cx from 'classnames';
import { socket } from "@/socket";
import { useEffect } from 'react';


const Toolbar = () => {

    const dispatch = useDispatch();

    const activeMenuItem = useSelector((state) => state.menu.activeMenuItem)

    const showStrokeToolbox = activeMenuItem === MENU_ITEMS.PENCIL;

    const showBruseToolbox = activeMenuItem === MENU_ITEMS.ERASER;

    const {color,size} = useSelector((state) => state.toolbar[activeMenuItem]);

    const updateSize = (e) => {
        dispatch(changeSize({item:activeMenuItem,size:e.target.value}));
    }

    const updateColor = (newColor) => {
        dispatch(changeColor({item:activeMenuItem,color:newColor}));
    }

    

    useEffect(() => {
        socket.emit('changeConfig',{color,size});
    },[color,size])

    return (
        <div className={styles.toolboxContainer}>
            {showStrokeToolbox && <div className={styles.toolItem}>
                <h4 className={styles.toolText}>Storke</h4>
                <div className={styles.itemContainer}>
                    <div className={cx(styles.colorBox,{[styles.active]: color === COLORS.BLACK})} style={{backgroundColor: COLORS.BLACK}} onClick={() => updateColor(COLORS.BLACK)}/>
                    <div className={cx(styles.colorBox,{[styles.active]: color === COLORS.RED})} style={{backgroundColor: COLORS.RED}} onClick={() => updateColor(COLORS.RED)}/>
                    <div className={cx(styles.colorBox,{[styles.active]: color === COLORS.GREEN})} style={{backgroundColor: COLORS.GREEN}} onClick={() => updateColor(COLORS.GREEN)}/>
                    <div className={cx(styles.colorBox,{[styles.active]: color === COLORS.BLUE})} style={{backgroundColor: COLORS.BLUE}} onClick={() => updateColor(COLORS.BLUE)}/>
                    <div className={cx(styles.colorBox,{[styles.active]: color === COLORS.ORANGE})} style={{backgroundColor: COLORS.ORANGE}} onClick={() => updateColor(COLORS.ORANGE)}/>
                    <div className={cx(styles.colorBox,{[styles.active]: color === COLORS.YELLOW})} style={{backgroundColor: COLORS.YELLOW}} onClick={() => updateColor(COLORS.YELLOW)}/>
                </div>
            </div>}
            
            <div className={styles.toolItem}>
                <h4 className={styles.toolText}>Brush Size</h4>
                <div className={styles.itemContainer}>
                    <input type="range" min={1} max={10} step={1} onChange={updateSize} value={size}/>
                </div>
            </div>

        </div>
    )
}

export default Toolbar;