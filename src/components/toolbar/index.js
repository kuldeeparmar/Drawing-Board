import styles from './index.module.css'
import { COLORS, MENU_ITEMS } from '@/constant';
import { useSelector } from 'react-redux';

const Toolbar = () => {

    const activeMenuItem = useSelector((state) => state.menu.activeMenuItem)

    const showStrokeToolbox = activeMenuItem === MENU_ITEMS.PENCIL;

    const showBruseToolbox = activeMenuItem === MENU_ITEMS.ERASER;

    return (
        <div className={styles.toolboxContainer}>
            {showStrokeToolbox && <div className={styles.toolItem}>
                <h4 className={styles.toolText}>Storke</h4>
                <div className={styles.itemContainer}>
                    <div className={styles.colorBox} style={{backgroundColor: COLORS.BLACK}}/>
                    <div className={styles.colorBox} style={{backgroundColor: COLORS.RED}}/>
                    <div className={styles.colorBox} style={{backgroundColor: COLORS.GREEN}}/>
                    <div className={styles.colorBox} style={{backgroundColor: COLORS.BLUE}}/>
                    <div className={styles.colorBox} style={{backgroundColor: COLORS.ORANGE}}/>
                    <div className={styles.colorBox} style={{backgroundColor: COLORS.YELLOW}}/>
                </div>
            </div>}
            
            <div className={styles.toolItem}>
                <h4 className={styles.toolText}>Brush Size {activeMenuItem}</h4>
                <div className={styles.itemContainer}>
                    <input type="range" min={1} max={10} step={1} />
                </div>
            </div>

        </div>
    )
}

export default Toolbar;