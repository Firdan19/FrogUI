import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from '@xyflow/react';

const getNodeStyle = (type) => {
  switch (type) {
    case 'START': return { icon: 'play_circle', color: 'var(--frog-color-olive, #a7b789)' };
    case 'INPUT': return { icon: 'chat', color: '#64b5f6' };
    case 'THOUGHT': return { icon: 'lightbulb', color: 'var(--frog-color-brass, #d8c7a3)' };
    case 'ACTION': return { icon: 'build', color: '#ffb74d' };
    case 'RESPONSE': return { icon: 'forum', color: '#ba68c8' };
    case 'END': return { icon: 'check_circle', color: 'var(--frog-color-olive, #a7b789)' };
    case 'STOPPED': return { icon: 'cancel', color: '#ff5252' };
    default: return { icon: 'memory', color: 'rgba(242, 238, 229, 0.6)' };
  }
};

const nodeTypes = {
  custom: ({ data }) => {
    const { icon, color } = getNodeStyle(data.type);
    
    return (
      <div style={{
        width: '280px',
        borderRadius: '8px',
        background: '#1f201f',
        border: '1px solid rgba(242, 238, 229, 0.1)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        color: 'var(--frog-color-ivory, #f2eee5)',
        fontFamily: 'var(--frog-font-sans, "Outfit", sans-serif)',
        overflow: 'hidden'
      }}>
        <Handle type="target" position={Position.Top} style={{ background: color, border: 'none' }} />
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 14px',
          background: 'rgba(0, 0, 0, 0.2)',
          borderBottom: '1px solid rgba(242, 238, 229, 0.05)'
        }}>
          <span className="material-icons-round" style={{ fontSize: '18px', marginRight: '8px', color }}>
            {icon}
          </span>
          <strong style={{ fontSize: '12px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            {data.type}
          </strong>
        </div>
        
        <div style={{ padding: '14px', fontSize: '13px', lineHeight: '1.5', color: 'rgba(242, 238, 229, 0.8)', wordBreak: 'break-word' }}>
          {data.label}
        </div>
        
        <Handle type="source" position={Position.Bottom} style={{ background: color, border: 'none' }} />
      </div>
    );
  }
};

export default function FlowVisualizer({ gatewayUrl }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const streamRef = useRef(null);
  const layoutYRef = useRef(50);
  const lastNodeIdRef = useRef(null);

  const addNodeToGraph = useCallback((type, label) => {
    const id = `node_${Date.now()}_${Math.random()}`;
    const newNode = {
      id,
      type: 'custom',
      position: { x: window.innerWidth / 2 - 140, y: layoutYRef.current },
      data: { type, label },
    };

    layoutYRef.current += 160;

    setNodes((nds) => [...nds, newNode]);

    if (lastNodeIdRef.current) {
      const newEdge = {
        id: `e_${lastNodeIdRef.current}-${id}`,
        source: lastNodeIdRef.current,
        target: id,
        animated: true,
        style: { stroke: 'rgba(242, 238, 229, 0.4)', strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    }

    lastNodeIdRef.current = id;
  }, [setNodes, setEdges]);

  useEffect(() => {
    const handleTaskCreated = (event) => {
      const task = event.detail;
      setNodes([]);
      setEdges([]);
      layoutYRef.current = 50;
      lastNodeIdRef.current = null;
      
      if (streamRef.current) {
        streamRef.current.close();
      }

      addNodeToGraph('START', `Task ID: ${task.task_id}`);

      const es = new EventSource(`${gatewayUrl}${task.stream_url}`);
      streamRef.current = es;

      es.addEventListener('stdout', (e) => {
        const payload = JSON.parse(e.data);
        const text = payload.content.trim();

        if (text.startsWith('Agent thought:')) {
          addNodeToGraph('THOUGHT', text.replace('Agent thought:', '').trim());
        } else if (text.startsWith('Agent action:')) {
          addNodeToGraph('ACTION', text.replace('Agent action:', '').trim());
        } else if (text.startsWith('Agent Response:')) {
          addNodeToGraph('RESPONSE', 'Generating Response...');
        } else if (text.startsWith('> User Command')) {
          addNodeToGraph('INPUT', text.trim());
        }
      });

      es.addEventListener('exit', () => {
        addNodeToGraph('END', 'Agent execution completed');
        es.close();
      });

      es.onerror = () => {
        es.close();
      };
    };

    const handleTaskStop = () => {
      if (streamRef.current) {
        streamRef.current.close();
        addNodeToGraph('STOPPED', 'Execution manually stopped');
      }
    };

    window.addEventListener('frogui:task-created', handleTaskCreated);
    window.addEventListener('frogui:task-stop', handleTaskStop);

    return () => {
      window.removeEventListener('frogui:task-created', handleTaskCreated);
      window.removeEventListener('frogui:task-stop', handleTaskStop);
      if (streamRef.current) streamRef.current.close();
    };
  }, [gatewayUrl, addNodeToGraph]);

  return (
    <div style={{ width: '100%', height: '100%', background: '#171918' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        colorMode="dark"
        fitView
        fitViewOptions={{ maxZoom: 1, minZoom: 0.2, padding: 0.2 }}
        minZoom={0.1}
        maxZoom={1.5}
      >
        <Background color="rgba(242, 238, 229, 0.1)" gap={20} size={1.5} />
        <Controls style={{ fill: 'var(--frog-color-brass, #d8c7a3)' }} />
      </ReactFlow>
    </div>
  );
}
