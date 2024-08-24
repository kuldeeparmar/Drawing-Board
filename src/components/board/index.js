import { MENU_ITEMS } from "@/constant";
import {useRef,useEffect,useLayoutEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { menuItemClick,actionItemClick} from "@/slice/menuSlice"
import { socket } from "@/socket";

const Board = () => {

    const drawHistory = useRef([]);
    const historyPointer = useRef(0);
    const canvasRef = useRef(null);
    const dispatch = useDispatch();
    const {activeMenuItem,actionMenuItem} = useSelector((state) => state.menu);
    const showRef = useRef(false);
    const {color,size} = useSelector((state) => state.toolbar[activeMenuItem]);

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
            if(drawHistory.current.length > 0) {
                const image = drawHistory.current[historyPointer.current];
                context.putImageData(image,0,0);
            }

        }

        dispatch(actionItemClick(null));

    }, [actionMenuItem,dispatch] )

    
    useEffect(() => {
        if(!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const changeConfig = (color, size) => {

            
            context.strokeStyle = color;
            context.lineWidth = size;

        }

        const handleChangeConfig = (config) => {
            changeConfig(config.color, config.size);
        }

        changeConfig(color, size);
        socket.on('changeConfig',handleChangeConfig);

        return () => {
            socket.off('changeConfig',handleChangeConfig);

        }

    },[color,size])

    useLayoutEffect(() => {
        if(!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
       
        
        

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
            beginPath(e.clientX || e.touches[0].clientX,e.clientY || e.touches[0].clientY);
            socket.emit('beginPath',{x: e.clientX || e.touches[0].clientX,y: e.clientY || e.touches[0].clientY})
        }

        const handleMouseMove = (e) => {
            if(!showRef.current) return
           drawLine(e.clientX || e.touches[0].clientX,e.clientY || e.touches[0].clientY);
           socket.emit('drawLine',{x: e.clientX || e.touches[0].clientX,y: e.clientY || e.touches[0].clientY})

        }

        const handleMouseUp = (e) => {
            showRef.current = false;
            const image = context.getImageData(0, 0, canvas.width, canvas.height);
                drawHistory.current.push(image);
                historyPointer.current = drawHistory.current.length - 1;
               
            
        }

        const handleBeginPath = (arg) => {
            beginPath(arg.x,arg.y);
        }

        const handleDrawLine = (arg) => {
            drawLine(arg.x,arg.y);
        }

        canvas.addEventListener('mousedown',handleMouseDown);
        canvas.addEventListener('mousemove',handleMouseMove);
        canvas.addEventListener('mouseup',handleMouseUp);

        canvas.addEventListener('touchstart', handleMouseDown)
        canvas.addEventListener('touchmove', handleMouseMove)
        canvas.addEventListener('touchend', handleMouseUp)


        
          socket.on('beginPath',handleBeginPath)
          socket.on('drawLine',handleDrawLine);
          
          

        return () => {
            canvas.removeEventListener('mousedown',handleMouseDown);
            canvas.removeEventListener('mousemove',handleMouseMove);
            canvas.removeEventListener('mouseup',handleMouseUp);

            canvas.removeEventListener('touchstart', handleMouseDown)
        canvas.removeEventListener('touchmove', handleMouseMove)
        canvas.removeEventListener('touchend', handleMouseUp)


            socket.off('beginPath',handleBeginPath)
          socket.off('drawLine',handleDrawLine);

        }

    },[])
    
    return (
        <canvas ref={canvasRef}></canvas>
    )
}

export default Board;