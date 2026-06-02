import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Position,
} from '@xyflow/react';

const nodeTypes = {
  custom: ({ data }) => {
    return (
      <div style={{
        padding: '12px 16px',
        borderRadius: '12px',
        background: 'rgba(242, 238, 229, 0.08)',
        backdropFilter: 'blur(18px)',
        border: '1px solid rgba(242, 238, 229, 0.1)',
        color: 'var(--frog-color-ivory, #f2eee5)',
        fontFamily: 'var(--frog-font-sans, "Outfit", sans-serif)',
        minWidth: '150px',
        maxWidth: '300px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}>
        <div style={{ 
          fontSize: '11px', 
          textTransform: 'uppercase', 
          color: 'var(--frog-color-brass, #d8c7a3)',
          marginBottom: '6px',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>
          {data.type}
        </div>
        <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
          {data.label}
        </div>
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
      position: { x: 250, y: layoutYRef.current },
      data: { type, label },
    };

    layoutYRef.current += 150;

    setNodes((nds) => [...nds, newNode]);

    if (lastNodeIdRef.current) {
      const newEdge = {
        id: `e_${lastNodeIdRef.current}-${id}`,
        source: lastNodeIdRef.current,
        target: id,
        animated: true,
        style: { stroke: 'var(--frog-color-brass, #d8c7a3)', strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    }

    lastNodeIdRef.current = id;
  }, [setNodes, setEdges]);

  useEffect(() => {
    const handleTaskCreated = (event) => {
      const task = event.detail;
      // Reset graph
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
          // The next line is the actual response, but since it's line-by-line, we might miss the actual content.
          // For simplicity, we just add the node "Generating Response"
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
      >
        <Background color="#333" gap={16} />
        <Controls style={{ fill: 'var(--frog-color-brass, #d8c7a3)' }} />
      </ReactFlow>
    </div>
  );
}
