import { fabric } from 'fabric';

export interface ProcessedImage {
  url: string;
  blob: Blob;
}

export interface ImageAssignments {
  main: File;
  'header-tl': File;
  'header-tr': File;
  'header-bl': File;
  'header-br': File;
  'footer-tl': File;
  'footer-tr': File;
  'footer-bl': File;
  'footer-br': File;
}

export class ClientImageProcessor {
  private canvas: fabric.Canvas | null = null;

  constructor() {
    // Initialize a temporary canvas for processing
    this.canvas = new fabric.Canvas(document.createElement('canvas'));
  }

  private async fileToImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  private async resizeImage(image: HTMLImageElement, width: number, height: number): Promise<fabric.Image> {
    return new Promise((resolve) => {
      const fabricImage = new fabric.Image(image, {
        left: 0,
        top: 0,
        width: width,
        height: height,
        scaleX: width / image.width,
        scaleY: height / image.height,
      });
      resolve(fabricImage);
    });
  }

  private async createCanvas(width: number, height: number): Promise<fabric.Canvas> {
    const canvas = new fabric.Canvas(document.createElement('canvas'));
    canvas.setWidth(width);
    canvas.setHeight(height);
    canvas.backgroundColor = 'white';
    return canvas;
  }

  private async canvasToBlob(canvas: fabric.Canvas): Promise<Blob> {
    return new Promise((resolve) => {
      const dataURL = canvas.toDataURL({
        format: 'jpeg',
        quality: 0.9,
        multiplier: 1
      });
      
      // Convert data URL to blob
      fetch(dataURL)
        .then(res => res.blob())
        .then(blob => resolve(blob));
    });
  }

  private async extractQuadrant(mainImage: fabric.Image, left: number, top: number, width: number, height: number): Promise<fabric.Image> {
    const quadrantCanvas = await this.createCanvas(width, height);
    
    const quadrantImage = new fabric.Image(mainImage.getElement(), {
      left: -left,
      top: -top,
      scaleX: mainImage.scaleX!,
      scaleY: mainImage.scaleY!,
    });
    
    quadrantCanvas.add(quadrantImage);
    quadrantCanvas.renderAll();
    
    const quadrantBlob = await this.canvasToBlob(quadrantCanvas);
    const quadrantImg = await this.blobToImage(quadrantBlob);
    
    quadrantCanvas.dispose();
    return new fabric.Image(quadrantImg);
  }

  private async blobToImage(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  }

  async processImages(assignments: ImageAssignments): Promise<ProcessedImage[]> {
    try {
      // Grid dimensions
      const gridWidth = 600 * 2;   // 1200
      const gridHeight = 337 * 2;  // 674
      const finalWidth = 600;
      const partHeight = 337;
      const finalHeight = partHeight * 3; // 1011

      // 1. Process main image to 1200x674
      const mainImg = await this.fileToImage(assignments.main);
      const resizedMain = await this.resizeImage(mainImg, gridWidth, gridHeight);

      // 2. Extract 4 quadrants from main image
      const quadrants = await Promise.all([
        this.extractQuadrant(resizedMain, 0, 0, 600, 337), // Top-left
        this.extractQuadrant(resizedMain, 600, 0, 600, 337), // Top-right
        this.extractQuadrant(resizedMain, 0, 337, 600, 337), // Bottom-left
        this.extractQuadrant(resizedMain, 600, 337, 600, 337), // Bottom-right
      ]);

      // 3. Process header and footer images
      const headerImages = await Promise.all([
        this.fileToImage(assignments['header-tl']),
        this.fileToImage(assignments['header-tr']),
        this.fileToImage(assignments['header-bl']),
        this.fileToImage(assignments['header-br']),
      ]);
      
      const headers = await Promise.all(
        headerImages.map(img => this.resizeImage(img, finalWidth, partHeight))
      );

      const footerImages = await Promise.all([
        this.fileToImage(assignments['footer-tl']),
        this.fileToImage(assignments['footer-tr']),
        this.fileToImage(assignments['footer-bl']),
        this.fileToImage(assignments['footer-br']),
      ]);
      
      const footers = await Promise.all(
        footerImages.map(img => this.resizeImage(img, finalWidth, partHeight))
      );

      // 4. Create final composite images
      const results: ProcessedImage[] = [];

      for (let i = 0; i < 4; i++) {
        const compositeCanvas = await this.createCanvas(finalWidth, finalHeight);
        
        // Add header
        const headerImage = new fabric.Image(headers[i].getElement(), {
          left: 0,
          top: 0,
          scaleX: headers[i].scaleX!,
          scaleY: headers[i].scaleY!,
        });
        compositeCanvas.add(headerImage);

        // Add quadrant
        const quadrantImage = new fabric.Image(quadrants[i].getElement(), {
          left: 0,
          top: partHeight,
          scaleX: quadrants[i].scaleX!,
          scaleY: quadrants[i].scaleY!,
        });
        compositeCanvas.add(quadrantImage);

        // Add footer
        const footerImage = new fabric.Image(footers[i].getElement(), {
          left: 0,
          top: partHeight * 2,
          scaleX: footers[i].scaleX!,
          scaleY: footers[i].scaleY!,
        });
        compositeCanvas.add(footerImage);

        compositeCanvas.renderAll();

        const blob = await this.canvasToBlob(compositeCanvas);
        const url = URL.createObjectURL(blob);
        
        results.push({
          url,
          blob,
        });

        compositeCanvas.dispose();
      }

      return results;
    } catch (error) {
      console.error('Error processing images:', error);
      throw error;
    }
  }

  /**
   * Splits a single image into 4 quadrants (2x2 grid) and returns them as ProcessedImage[]
   * @param file The image file to split
   */
  async splitImageToGrid(file: File): Promise<ProcessedImage[]> {
    // Grid dimensions (same as used in processImages)
    const gridWidth = 600 * 2;   // 1200
    const gridHeight = 337 * 2;  // 674
    const partWidth = 600;
    const partHeight = 337;

    // 1. Load and resize the image to 1200x674
    const mainImg = await this.fileToImage(file);
    const resizedMain = await this.resizeImage(mainImg, gridWidth, gridHeight);

    // 2. Extract 4 quadrants from the resized image
    const quadrants = await Promise.all([
      this.extractQuadrant(resizedMain, 0, 0, partWidth, partHeight), // Top-left
      this.extractQuadrant(resizedMain, partWidth, 0, partWidth, partHeight), // Top-right
      this.extractQuadrant(resizedMain, 0, partHeight, partWidth, partHeight), // Bottom-left
      this.extractQuadrant(resizedMain, partWidth, partHeight, partWidth, partHeight), // Bottom-right
    ]);

    // 3. Convert each quadrant to a blob and URL
    const results: ProcessedImage[] = [];
    for (const quadrant of quadrants) {
      // Render to canvas and get blob
      const canvas = await this.createCanvas(partWidth, partHeight);
      canvas.add(quadrant);
      canvas.renderAll();
      const blob = await this.canvasToBlob(canvas);
      const url = URL.createObjectURL(blob);
      results.push({ url, blob });
      canvas.dispose();
    }
    return results;
  }

  dispose() {
    if (this.canvas) {
      this.canvas.dispose();
      this.canvas = null;
    }
  }
} 