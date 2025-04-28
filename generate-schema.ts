import fs from 'fs';
import path from 'path';
import { componentRegistryToXsd } from './src/lib/pages/home/components/xml-renderer/schema-generator';
import { xmlRegistry } from './src/lib/pages/home/components/xml-registry';

// Generate the XSD schema from the registry
const xsdContent = componentRegistryToXsd(xmlRegistry, 'response');

// Define the output path (in the root of your project)
const outputPath = path.resolve(process.cwd(), 'schema.xsd');

// Write the XSD to file
fs.writeFileSync(outputPath, xsdContent);

console.log(`XSD schema generated and saved to: ${outputPath}`); 