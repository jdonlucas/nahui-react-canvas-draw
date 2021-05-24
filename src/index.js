import React, { useRef, useEffect } from 'react';

export default function NahuiCanvas(props) {
  const canvas = useRef(null);

  var localScale = props.scale ? props.scale : 1;

  var ctx, flag = false,
      parentScrollable,
      prevX = 0,
      currX = 0,
      prevY = 0,
      currY = 0,
      scrollX = 0,
      scrollY = 0,
      dot_flag = false;

  var x = props.color ? props.color : 'black';

  useEffect(() => {
    if (canvas && canvas.current) {
      ctx = canvas.current.getContext("2d");
      canvas.current.addEventListener("mousemove", findxyMove);
      canvas.current.addEventListener("mousedown", findxyDown);
      canvas.current.addEventListener("mouseup", findxyUpOut);
      canvas.current.addEventListener("mouseout", findxyUpOut);
      parentScrollable = getScrollParent(canvas.current)
      parentScrollable.addEventListener('scroll', moveCursor);
      scrollX = parentScrollable.scrollLeft;
      scrollY =  parentScrollable.scrollTop;
      return () => {
        canvas.current.removeEventListener("mousemove", findxyMove);
        canvas.current.removeEventListener("mousedown", findxyDown);
        canvas.current.removeEventListener("mouseup", findxyUpOut);
        canvas.current.removeEventListener("mouseout", findxyUpOut);
      }
    }
  }, [canvas, props.scale, props.brushSize, props.color]);

  const moveCursor = (e) => {
    scrollX = e.target.scrollLeft;
    scrollY = e.target.scrollTop;
  }

  const draw = () => {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = props.brushSize ? props.brushSize : 2;
    ctx.stroke();
    ctx.closePath();
  }

  const erase = () => {
    ctx.clearRect(0, 0, 1080, 500);
  }

  const findxyDown = (e) => {
    currX = (e.clientX - canvas.current.offsetLeft + scrollX) / localScale;
    currY = (e.clientY - canvas.current.offsetTop + scrollY) / localScale;

    flag = true;
    dot_flag = true;
    if (dot_flag) {
      ctx.beginPath();
      ctx.fillStyle = x;
      ctx.fillRect(currX, currY, 2, 2);
      ctx.closePath();
      dot_flag = false;
    }
  }

  const findxyUpOut = (e) => {
    flag = false;
  }
  const findxyMove = (e) => {
    if (flag) {
      prevX = currX;
      prevY = currY;
      currX = (e.clientX - canvas.current.offsetLeft + scrollX) / localScale;
      currY = (e.clientY - canvas.current.offsetTop + scrollY) / localScale;
      draw();
    }
  }
  
  const getScrollParent = (node) => {
    const isElement = node instanceof HTMLElement;
    const overflowY = isElement && window.getComputedStyle(node).overflowY;
    const overflowX = isElement && window.getComputedStyle(node).overflowX;
    const isScrollable = (overflowY !== 'visible' && overflowY !== 'hidden') || (overflowX !== 'visible' && overflowX !== 'hidden');

    if (!node) {
      return null;
    } else if (isScrollable && ((node.scrollHeight >= node.clientHeight) || (node.scrollWidth >= node.clientWidth)) ) {
      return node;
    }

    return getScrollParent(node.parentNode) || document.body;
  }

  const canvasStyle = {
    background: 'white',
    transform: 'scale(' + localScale + ')',
    transformOrigin: '0 0'
  };

  return (
    <canvas ref={canvas} id="nahui-canvas" width={1080} height={500} style={canvasStyle}></canvas>
  )
}
