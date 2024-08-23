import { MENU_ITEMS } from "@/constant";
import {useRef,useEffect,useLayoutEffect} from "react";
import { useDispatch, useSelector } from "react-redux";

const Board = () => {

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
            console.log(URL);
            const anchor = document.createElement('a');
            anchor.href = URL;
            anchor.download = 'sketch.jpg';
            anchor.click();
        }

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
        }

        const handleMouseMove = (e) => {
            if(!showRef.current) return
           drawLine(e.clientX,e.clientY);

        }

        const handleMouseUp = (e) => {
            showRef.current = false;

        }

        canvas.addEventListener('mousedown',handleMouseDown);
        canvas.addEventListener('mousemove',handleMouseMove);
        canvas.addEventListener('mouseup',handleMouseUp);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);

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