#version 120 

// Lighting uniform variables -- these can be set once and left alone:
uniform float uKa, uKd, uKs;       // Coefficients of each type of lighting -- make sum to 1.0
uniform vec3  uColor;              // Object color
uniform vec3  uSpecularColor;      // Light color
uniform float uShininess;          // Specular exponent

// Square-equation uniform variables -- these should be set every time Display( ) is called:
uniform float uS0, uT0, uD;
uniform float uSc, uTc;
uniform float uRs, uRt;

// Varying variables from the vertex shader and interpolated in the rasterizer:
varying vec3  vN;                  // Normal vector
varying vec3  vL;                  // Vector from point to light
varying vec3  vE;                  // Vector from point to eye
varying vec2  vST;                 // (s,t) texture coordinates

void main()
{
    float s = vST.s;
    float t = vST.t;

    vec3 myColor = uColor;
    if (((s - uSc) / uRs) * ((s - uSc) / uRs) + ((t - uTc) / uRt) * ((t - uTc) / uRt) <= 1.0)
    {
        myColor = vec3(1., 0., 0.);
    }

    // Apply the per-fragment lighting to myColor:
    vec3 Normal = normalize(vN);
    vec3 Light  = normalize(vL);
    vec3 Eye    = normalize(vE);

    vec3 ambient = uKa * myColor;

    float dd = max(dot(Normal, Light), 0.);  // Only do diffuse if the light can see the point
    vec3 diffuse = uKd * dd * myColor;

    float ss = 0.;
    if (dot(Normal, Light) > 0.)            // Only do specular if the light can see the point
    {
        vec3 ref = normalize(reflect(-Light, Normal));
        ss = pow(max(dot(Eye, ref), 0.), uShininess);
    }
    vec3 specular = uKs * ss * uSpecularColor;
    gl_FragColor = vec4(ambient + diffuse + specular, 1.);
}
