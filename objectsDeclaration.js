// Declaration of scene objects and lights

// Sphere!
// A sphere is defined as the set of all points in three-dimensional Euclidean space R^3 
// that are located at a distance r (the "radius") from a given point (the "center").
// Weisstein, Eric W. "Sphere." From MathWorld--A Wolfram Web Resource. http://mathworld.wolfram.com/Sphere.html

function Sphere(){
    
    this.type = 0;
    // XYZ values, fourth value is radius
	this.position = [0.0,0.0,0.0,1.0];
	
	// RGBA 
	this.color = [1.0,1.0,1.0,1.0];
	
	// Specular lighting, diffuse lighting component, reflection component, and unused
	this.material = [0.0,0.0,0.0,0.0];
       
}

// Light!
// Light is electromagnetic radiation within a certain portion of the electromagnetic spectrum. The word usually refers to visible light, which is visible to the human eye and is responsible for the sense of sight.[1] Visible light is usually defined as having wavelengths in the range of 400–700 nanometres (nm), or 4.00 × 10−7 to 7.00 × 10−7 m, between the infrared (with longer wavelengths) and the ultraviolet (with shorter wavelengths).
// Generally a source of light can be considered a point source if the resolution of the imaging instrument is too low to resolve its apparent size.
// Wikipedia. "Light". From https://en.wikipedia.org/wiki/Light

function Light() {
    // XYZ values, unused
	this.position = [0.0,0.0,0.0,0.0];
    // RGB values, unused
	this.color = [1.0,1.0,1.0,1.0];

	return this;
}