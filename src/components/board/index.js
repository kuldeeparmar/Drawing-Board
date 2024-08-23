import { MENU_ITEMS } from "@/constant";
import {useRef,useEffect,useLayoutEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { menuItemClick,actionItemClick} from "@/slice/menuSlice"

const Board = () => {

    const drawHistory = useRef([]);
    const historyPointer = useRef(0);
    const canvasRef = useRef(null);
    const dispatch = useDispatch();
    const {activeMenuItem,actionMenuItem} = useSelector((state) => state.menu);
    const showRef = useRef(false);
    const {color,size} = useSelector((state) => state.toolbar[activeMenuItem]);

    //const strokeCoordinate = useRef([]);

    useEffect(() => {
        if(!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if(actionMenuItem === MENU_ITEMS.DOWNLOAD) {
            const URL = canvas.toDataURL();
            const anchor = document.createElement('a');
            anchor.href = URL;
            anchor.download = 'sketch.jpg';
            anchor.click();
        } else if(actionMenuItem === MENU_ITEMS.UNDO  || actionMenuItem === MENU_ITEMS.REDO) {
            if(historyPointer.current > 0 && actionMenuItem === MENU_ITEMS.UNDO) historyPointer.current -= 1;
            if(historyPointer.current < drawHistory.current.length -1 && actionMenuItem === MENU_ITEMS.REDO) historyPointer.current += 1;
            const image = drawHistory.current[historyPointer.current];
            context.putImageData(image,0,0);

        }

        dispatch(actionItemClick(null));

    }, [actionMenuItem,dispatch] )

    
    useEffect(() => {
        if(!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const changeConfig = () => {

            context.strokeStyle = color;
            context.lineWidth = size;

        }
        changeConfig();

    },[color,size])

    useLayoutEffect(() => {
        if(!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        drawHistory.current.push(context.getImageData(0, 0, canvas.width, canvas.height));
        

        const beginPath = (x, y) => {
            context.beginPath();
            context.moveTo(x, y);
        }

        const drawLine = (x, y) => {
            context.lineTo(x, y);
            context.stroke();
        }

        const handleMouseDown = (e) => {
            showRef.current = true;
            beginPath(e.clientX,e.clientY);
            // console.log('Down')
            // if(strokeCoordinate.length < 2) {
            //     strokeCoordinate.current.push(e.clientX);
            //     strokeCoordinate.current.push(e.clientY);
            // }
        }

        const handleMouseMove = (e) => {
            if(!showRef.current) return
           drawLine(e.clientX,e.clientY);

        }

        const handleMouseUp = (e) => {
            showRef.current = false;
            // console.log('Up')

            // if(strokeCoordinate.current.length < 4 && strokeCoordinate.current.length > 0) {
            //     strokeCoordinate.current.push(e.clientX);
            //     strokeCoordinate.current.push(e.clientY);
            // }
            // console.log(strokeCoordinate.current.length);

            const image = context.getImageData(0, 0, canvas.width, canvas.height);
            
            // if(drawHistory.current.length > 0 && image != drawHistory.current[historyPointer.current]) {
                drawHistory.current.push(image);
                historyPointer.current = drawHistory.current.length - 1;
               
            //}

            //strokeCoordinate.current = [];
        }

        canvas.addEventListener('mousedown',handleMouseDown);
        canvas.addEventListener('mousemove',handleMouseMove);
        canvas.addEventListener('mouseup',handleMouseUp);
        

        return () => {
            canvas.removeEventListener('mouseDown',handleMouseDown);
            canvas.removeEventListener('mousemove',handleMouseMove);
            canvas.removeEventListener('mouseUp',handleMouseUp);
        }

    },[])
    
    return (
        <canvas ref={canvasRef}></canvas>
    )
}

export default Board;