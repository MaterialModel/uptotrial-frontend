import fs from 'node:fs';
import path from 'node:path';
import { xmlRegistry } from './xml-registry';
import { componentRegistryToXsd } from './xml-renderer/schema-generator';

// Generate the XSD schema from the registry
const xsdContent = componentRegistryToXsd(xmlRegistry, 'response');

// Define the output path
const outputPath = path.resolve(__dirname, '../../../../', 'schema.xsd');

// Write the XSD to file
fs.writeFileSync(outputPath, xsdContent);
