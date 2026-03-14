import { useState, useEffect, useRef, useCallback } from "react";
import { RefreshCw, Monitor, TreePine } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ipc } from "@/ipc/manager";
import { useSelectedDevice } from "@/hooks/use-selected-device";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface XMLNode {
  name: string;
  attributes: Record<string, string>;
  children: XMLNode[];
  text?: string;
}

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

const calculateMaxDepth = (node: XMLNode, currentDepth: number = 0): number => {
  if (!node.children || node.children.length === 0) {
    return currentDepth;
  }
  
  let maxChildDepth = currentDepth;
  for (const child of node.children) {
    const childDepth = calculateMaxDepth(child, currentDepth + 1);
    maxChildDepth = Math.max(maxChildDepth, childDepth);
  }
  
  return maxChildDepth;
};

export const UIInspector: React.FC = () => {
  const { t } = useTranslation();
  const { selectedDevice } = useSelectedDevice();
  const [leftWidth, setLeftWidth] = useState(70);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string>("");
  const [xmlData, setXmlData] = useState<XMLNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<XMLNode | null>(null);
  const [maxDepth, setMaxDepth] = useState<number>(0);
  const [currentDepth, setCurrentDepth] = useState<number>(0);
  const [selectedNodeForOverlay, setSelectedNodeForOverlay] = useState<XMLNode | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const screenshotRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!(isDragging && containerRef.current)) {
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth =
      ((e.clientX - containerRect.left) / containerRect.width) * 100;

    if (newLeftWidth >= 20 && newLeftWidth <= 80) {
      setLeftWidth(newLeftWidth);
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const parseBounds = (boundsStr: string): Bounds | null => {
    const match = boundsStr.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);
    if (!match) return null;

    const [, x1, y1, x2, y2] = match.map(Number);
    return {
      x: x1,
      y: y1,
      width: x2 - x1,
      height: y2 - y1,
    };
  };

  const parseXMLToNode = (element: Element): XMLNode => {
    const node: XMLNode = {
      name: element.tagName,
      attributes: {},
      children: [],
    };

    // Parse attributes
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      node.attributes[attr.name] = attr.value;
    }

    // Parse children
    for (let i = 0; i < element.children.length; i++) {
      const child = element.children[i];
      node.children.push(parseXMLToNode(child));
    }

    return node;
  };

  const refreshPage = () => {
    // Clear all current data
    setScreenshotUrl("");
    setXmlData(null);
    setSelectedNode(null);
    setSelectedNodeForOverlay(null);
    setMaxDepth(0);
    setCurrentDepth(0);
    setExpandedNodes(new Set());
    
    // Fetch fresh data
    fetchData();
  };

  const fetchData = useCallback(async () => {

    setLoading(true);
    let screenshotSuccess = false;
    let xmlSuccess = false;
    
    try {
      // Take screenshot
      const screenshotResult = await ipc.client.adb.takeScreenshot({
        deviceId: selectedDevice.id,
      });

      if (!screenshotResult.success) {
        throw new Error(screenshotResult.error || "Failed to take screenshot");
      }
      screenshotSuccess = true;

      // Get screenshot as base64
      const base64Result = await ipc.client.adb.getScreenshotBase64({
        deviceId: selectedDevice.id,
      });

      if (!base64Result.success) {
        throw new Error(base64Result.error || "Failed to get screenshot data");
      }

      // Set screenshot URL
      const base64Data = base64Result.output;
      setScreenshotUrl(`data:image/png;base64,${base64Data}`);

      // Dump UI XML
      const dumpResult = await ipc.client.adb.dumpUIXml({
        deviceId: selectedDevice.id,
      });

      if (!dumpResult.success) {
        throw new Error(dumpResult.error || "Failed to dump UI XML");
      }

      // Get UI XML
      const xmlResult = await ipc.client.adb.getUIXml({
        deviceId: selectedDevice.id,
      });

      if (!xmlResult.success) {
        throw new Error(xmlResult.error || "Failed to get UI XML");
      }
      xmlSuccess = true;

      // Parse XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlResult.output, "text/xml");
      const rootNode = xmlDoc.documentElement;
      
      if (rootNode) {
        const parsedNode = parseXMLToNode(rootNode);
        setXmlData(parsedNode);
        
        // Calculate max depth
        const depth = calculateMaxDepth(parsedNode);
        setMaxDepth(depth);
        
        // Only reset to 0 if current depth is beyond new max depth
        if (currentDepth > depth) {
          setCurrentDepth(depth);
        }
        
        // Expand all nodes by default
        const allNodeIds = new Set<string>();
        getAllNodeIds(parsedNode, allNodeIds);
        setExpandedNodes(allNodeIds);
      }

      // Only show success message if both operations succeeded
      if (screenshotSuccess && xmlSuccess) {
        toast.success("UI Inspector data refreshed successfully");
      }
    } catch (error) {
      console.error("Failed to fetch UI Inspector data:", error);
      
      // Handle specific ADB error codes
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch data";
      
      if (errorMessage.includes("137")) {
        toast.error("Device screen is locked or unavailable. Please unlock device and try again.");
      } else if (errorMessage.includes("device not found")) {
        toast.error("No device connected. Please connect a device and try again.");
      } else if (errorMessage.includes("command not found")) {
        toast.error("UI Automator not available on this device. Please check device compatibility.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedDevice]);

  const getAllNodeIds = (node: XMLNode, ids: Set<string>) => {
    const nodeId = `${node.name}-${Object.entries(node.attributes).join('-')}`;
    ids.add(nodeId);
    node.children.forEach(child => getAllNodeIds(child, ids));
  };

  const findNodeDepth = (targetNode: XMLNode, node: XMLNode, currentDepth: number = 0): number => {
    if (node === targetNode) {
      return currentDepth;
    }
    
    for (const child of node.children) {
      const depth = findNodeDepth(targetNode, child, currentDepth + 1);
      if (depth !== -1) return depth;
    }
    
    return -1; // Not found
  };

  const scrollToXmlNode = (node: XMLNode) => {
    const nodeId = getNodeId(node);
    const element = document.querySelector(`[data-node-id="${nodeId}"]`);
    
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      // Add temporary highlight effect
      element.classList.add('bg-green-100', 'border-green-500');
      setTimeout(() => {
        element.classList.remove('bg-green-100', 'border-green-500');
      }, 1000);
    }
  };

  const toggleNodeExpansion = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const getNodeId = (node: XMLNode): string => {
    return `${node.name}-${Object.entries(node.attributes).join('-')}`;
  };

  const getNodeDisplayText = (node: XMLNode): string => {
    const className = node.attributes["class"] || node.name;
    const classNameParts = className.split('.');
    const simpleClassName = classNameParts[classNameParts.length - 1];

    if (simpleClassName.includes("TextView")) {
      const text = node.attributes["text"] || "No text";
      return text.length > 30 ? text.substring(0, 30) + "..." : text;
    }

    return simpleClassName;
  };

  const getResourceId = (node: XMLNode): string => {
    const resourceId = node.attributes["resource-id"] || "";
    if (!resourceId.includes("/")) return resourceId;
    return resourceId.split("/")[1] || "";
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast.error("Failed to copy to clipboard");
    }
  };

  const renderXMLTree = (node: XMLNode, level: number = 0): JSX.Element => {
    const nodeId = getNodeId(node);
    const isExpanded = expandedNodes.has(nodeId);
    const hasChildren = node.children.length > 0;
    const resourceId = getResourceId(node);
    const bounds = node.attributes["bounds"];
    const hasBounds = !!bounds;
    const isAtCurrentDepth = level === currentDepth;
    const isSelectedForOverlay = selectedNodeForOverlay === node;

    return (
      <div key={nodeId} className="select-none">
        <div
          data-node-id={nodeId}
          className={`flex items-center gap-1 py-1 px-2 hover:bg-muted/50 cursor-pointer text-xs ${
            selectedNode === node ? "bg-muted" : ""
          } ${
            isAtCurrentDepth ? "border-l-4 border-l-blue-500 bg-blue-50" : ""
          } ${
            isSelectedForOverlay ? "bg-green-100 border-l-4 border-l-green-500" : ""
          }`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={(e) => {
            // Only set selection states, don't toggle expansion
            setSelectedNode(node);
            setSelectedNodeForOverlay(node);
          }}
        >
          {hasChildren && (
            <div 
              className="text-muted-foreground cursor-pointer hover:bg-muted-200 rounded p-1 mr-1 -ml-2"
              onClick={(e) => {
                e.stopPropagation();
                toggleNodeExpansion(nodeId);
              }}
            >
              {isExpanded ? "▼" : "▶"}
            </div>
          )}
          {!hasChildren && <span className="w-4" />}
          
          <span className="font-mono font-medium text-foreground">
            {getNodeDisplayText(node)}
          </span>
          
          {resourceId && (
            <button
              className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(resourceId);
              }}
            >
              {resourceId}
            </button>
          )}
          
          {hasBounds && (
            <span className="ml-2 text-green-600 text-xs">
              📐
            </span>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {node.children.map(child => renderXMLTree(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const drawOverlay = useCallback(() => {
    if (!overlayRef.current || !screenshotRef.current || !xmlData) return;

    const overlay = overlayRef.current;
    const screenshot = screenshotRef.current;
    
    // Clear existing overlay
    overlay.innerHTML = "";

    // Get screenshot dimensions and position
    const screenshotRect = screenshot.getBoundingClientRect();
    const containerRect = overlay.parentElement?.getBoundingClientRect();
    
    if (!containerRect) return;

    // Calculate screenshot position relative to container
    const screenshotLeft = screenshotRect.left - containerRect.left;
    const screenshotTop = screenshotRect.top - containerRect.top;
    
    const scaleX = screenshotRect.width / (screenshot.naturalWidth || 1080);
    const scaleY = screenshotRect.height / (screenshot.naturalHeight || 1920);

    // Position overlay to exactly match screenshot
    overlay.style.position = 'absolute';
    overlay.style.left = `${screenshotLeft}px`;
    overlay.style.top = `${screenshotTop}px`;
    overlay.style.width = `${screenshotRect.width}px`;
    overlay.style.height = `${screenshotRect.height}px`;

    // Function to draw rectangles for nodes at specific depth
    const drawRectanglesForNode = (node: XMLNode, depth: number = 0) => {
      const bounds = node.attributes["bounds"];
      if (bounds) {
        const parsedBounds = parseBounds(bounds);
        if (parsedBounds && depth === currentDepth) {
          const rect = document.createElement("div");
          rect.className = "absolute border border-white box-shadow-[0_0_0_2px_black cursor-pointer hover:border-blue-400 transition-colors";
          rect.style.left = `${parsedBounds.x * scaleX}px`;
          rect.style.top = `${parsedBounds.y * scaleY}px`;
          rect.style.width = `${parsedBounds.width * scaleX}px`;
          rect.style.height = `${parsedBounds.height * scaleY}px`;
          rect.style.pointerEvents = "auto";
          
          // Highlight selected node
          if (selectedNode === node) {
            rect.style.backgroundColor = "rgba(59, 130, 246, 0.2)";
            rect.style.borderColor = "#3b82f6";
            rect.style.boxShadow = "0 0 0 2px #3b82f6";
          }
          
          // Add click handler for overlay → XML synchronization
          rect.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Find and scroll to XML node
            scrollToXmlNode(node);
            
            // Set selected states
            setSelectedNode(node);
            setSelectedNodeForOverlay(node);
            
            // Move slider to this node's depth if not already at current depth
            const nodeDepth = findNodeDepth(node, xmlData!, 0);
            if (nodeDepth !== -1 && nodeDepth !== currentDepth) {
              setCurrentDepth(nodeDepth);
            }
          });
          
          overlay.appendChild(rect);
        }
      }
      
      // Recursively draw for children
      node.children.forEach(child => drawRectanglesForNode(child, depth + 1));
    };

    drawRectanglesForNode(xmlData);
  }, [xmlData, selectedNode, selectedNodeForOverlay, currentDepth]);

  useEffect(() => {
    drawOverlay();
  }, [drawOverlay]);

  // Redraw overlay when divider is being dragged
  useEffect(() => {
    if (isDragging) {
      const interval = setInterval(() => {
        drawOverlay();
      }, 16); // ~60fps
      
      return () => clearInterval(interval);
    }
  }, [isDragging, drawOverlay, currentDepth, selectedNodeForOverlay]);

  // Add resize observer to detect container size changes
  useEffect(() => {
    if (!overlayRef.current?.parentElement) return;

    const resizeObserver = new ResizeObserver(() => {
      drawOverlay();
    });

    resizeObserver.observe(overlayRef.current.parentElement);

    return () => resizeObserver.disconnect();
  }, [drawOverlay, currentDepth, selectedNodeForOverlay]);

  // Handle image load and scroll events
  useEffect(() => {
    const handleScroll = () => drawOverlay();
    const handleResize = () => drawOverlay();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [drawOverlay, currentDepth, selectedNodeForOverlay]);

  // Handle image load
  useEffect(() => {
    const img = screenshotRef.current;
    if (!img) return;

    const handleImageLoad = () => {
      drawOverlay();
    };

    img.addEventListener('load', handleImageLoad);
    
    // If image is already loaded
    if (img.complete) {
      handleImageLoad();
    }

    return () => {
      img.removeEventListener('load', handleImageLoad);
    };
  }, [screenshotUrl, drawOverlay, currentDepth, selectedNodeForOverlay]);

  useEffect(() => {
    // Initial data fetch
    if (selectedDevice?.id) {
      fetchData();
    }
  }, [selectedDevice?.id]);

  return (
    <div className="flex h-full overflow-hidden">
      <div className="relative flex flex-1 min-w-0" ref={containerRef}>
        {/* Left Section - XML Tree */}
        <div
          className="flex flex-col h-full bg-background border-r"
          style={{ width: `${leftWidth}%` }}
        >
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-2">
              <TreePine className="h-4 w-4" />
              <h3 className="font-medium text-sm">UI Hierarchy</h3>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={refreshPage}
              disabled={loading || !selectedDevice?.id}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
          
          <div className="flex-1 overflow-auto p-2">
            {xmlData ? (
              <div className="font-mono text-xs">
                {renderXMLTree(xmlData)}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {selectedDevice?.id ? "Click refresh to load UI data" : "Select a device first"}
              </div>
            )}
          </div>
        </div>

        {/* Resizable Divider */}
        <div
          className="relative cursor-col-resize bg-border hover:bg-muted-foreground transition-colors"
          style={{ width: '1px' }}
          onMouseDown={handleMouseDown}
        />

        {/* Right Section - Screenshot */}
        <div className="flex flex-col h-full flex-1">
          <div className="flex items-center justify-between p-3 border-b">
            {xmlData && maxDepth > 0 ? (
              <div className="flex items-center gap-3 w-full">
                <span className="text-xs text-muted-foreground">Depth</span>
                <Slider
                  value={[currentDepth]}
                  onValueChange={(value) => setCurrentDepth(value[0])}
                  max={maxDepth}
                  min={0}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-4">{currentDepth}</span>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                {selectedDevice?.name || "No device"}
              </div>
            )}
          </div>
          
          <div className="flex-1 relative overflow-hidden bg-muted/20">
            {screenshotUrl ? (
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <img
                  ref={screenshotRef}
                  src={screenshotUrl}
                  alt="Device screenshot"
                  className="max-w-full max-h-full object-contain border border-border"
                />
                <div
                  ref={overlayRef}
                  className="absolute pointer-events-none"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {selectedDevice?.id ? "Click refresh to capture screenshot" : "Select a device first"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
