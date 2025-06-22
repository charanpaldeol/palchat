#!/usr/bin/env node

/**
 * Verification Script: Check Stable State
 * This script verifies that all critical files exist and the system is in a stable state
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logError(message) {
    log(`❌ ${message}`, 'red');
}

function logWarning(message) {
    log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
    log(`ℹ️  ${message}`, 'blue');
}

// Critical files that must exist for stable state
const criticalFiles = [
    // Main pages
    'myastosite/src/pages/index.astro',
    'myastosite/src/pages/journey.astro',
    'myastosite/src/pages/p2p-framework.astro',
    'myastosite/src/pages/track-me.astro',
    'myastosite/src/pages/contact.astro',
    
    // Layout and components
    'myastosite/src/layouts/Layout.astro',
    'myastosite/src/components/HeroSection.astro',
    'myastosite/src/components/VisionSection.astro',
    'myastosite/src/components/MissionSection.astro',
    'myastosite/src/components/ValuesSection.astro',
    'myastosite/src/components/CTASection.astro',
    
    // API endpoints
    'myastosite/src/pages/api/contact.js',
    'myastosite/src/pages/api/test-email.js',
    'myastosite/src/pages/api/test-email-step.js',
    'myastosite/src/pages/api/debug-contact.js',
    
    // Utilities and styles
    'myastosite/src/utils/security.js',
    'myastosite/src/styles/global.css',
    
    // Configuration files
    'myastosite/package.json',
    'myastosite/astro.config.mjs',
    'myastosite/tailwind.config.mjs',
    'myastosite/vercel.json',
    
    // Root files
    'README.md',
    'robots.txt',
    'sitemap.xml',
    'vercel.json'
];

// Required dependencies in package.json
const requiredDependencies = [
    'astro',
    '@astrojs/react',
    '@astrojs/tailwind',
    '@astrojs/vercel',
    'nodemailer',
    'react',
    'react-dom',
    'tailwindcss'
];

// Required scripts in package.json
const requiredScripts = [
    'dev',
    'build',
    'preview'
];

function checkFileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch (error) {
        return false;
    }
}

function checkPackageJson() {
    const packagePath = 'myastosite/package.json';
    
    if (!checkFileExists(packagePath)) {
        logError(`Package.json not found at ${packagePath}`);
        return false;
    }
    
    try {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        
        // Check dependencies
        const missingDeps = requiredDependencies.filter(dep => 
            !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
        );
        
        if (missingDeps.length > 0) {
            logWarning(`Missing dependencies: ${missingDeps.join(', ')}`);
        }
        
        // Check scripts
        const missingScripts = requiredScripts.filter(script => 
            !packageJson.scripts?.[script]
        );
        
        if (missingScripts.length > 0) {
            logWarning(`Missing scripts: ${missingScripts.join(', ')}`);
        }
        
        return missingDeps.length === 0 && missingScripts.length === 0;
        
    } catch (error) {
        logError(`Error reading package.json: ${error.message}`);
        return false;
    }
}

function checkAstroConfig() {
    const configPath = 'myastosite/astro.config.mjs';
    
    if (!checkFileExists(configPath)) {
        logError(`Astro config not found at ${configPath}`);
        return false;
    }
    
    try {
        const configContent = fs.readFileSync(configPath, 'utf8');
        
        // Check for required configurations
        const requiredConfigs = [
            'defineConfig',
            'tailwind',
            'react',
            'vercel'
        ];
        
        const missingConfigs = requiredConfigs.filter(config => 
            !configContent.includes(config)
        );
        
        if (missingConfigs.length > 0) {
            logWarning(`Missing configs in astro.config.mjs: ${missingConfigs.join(', ')}`);
        }
        
        return missingConfigs.length === 0;
        
    } catch (error) {
        logError(`Error reading astro.config.mjs: ${error.message}`);
        return false;
    }
}

function verifyStableState() {
    log('🔍 Verifying stable Astro frontend state...', 'bright');
    log('==================================================', 'bright');
    
    let allChecksPassed = true;
    let filesChecked = 0;
    let filesMissing = 0;
    
    // Check critical files
    log('\n📁 Checking critical files...', 'cyan');
    
    criticalFiles.forEach(file => {
        filesChecked++;
        if (checkFileExists(file)) {
            logSuccess(`${file}`);
        } else {
            logError(`${file} - MISSING`);
            filesMissing++;
            allChecksPassed = false;
        }
    });
    
    // Check package.json
    log('\n📦 Checking package.json...', 'cyan');
    if (checkPackageJson()) {
        logSuccess('Package.json configuration is correct');
    } else {
        logError('Package.json has issues');
        allChecksPassed = false;
    }
    
    // Check Astro config
    log('\n⚙️  Checking Astro configuration...', 'cyan');
    if (checkAstroConfig()) {
        logSuccess('Astro configuration is correct');
    } else {
        logError('Astro configuration has issues');
        allChecksPassed = false;
    }
    
    // Summary
    log('\n📊 Verification Summary:', 'bright');
    log(`   Files checked: ${filesChecked}`, 'blue');
    log(`   Files missing: ${filesMissing}`, filesMissing > 0 ? 'red' : 'green');
    log(`   Package.json: ${checkPackageJson() ? '✅' : '❌'}`, checkPackageJson() ? 'green' : 'red');
    log(`   Astro config: ${checkAstroConfig() ? '✅' : '❌'}`, checkAstroConfig() ? 'green' : 'red');
    
    if (allChecksPassed) {
        log('\n🎉 All checks passed! System is in stable state.', 'green');
        log('✅ Ready for development or rollback', 'green');
        
        log('\n🚀 Next Steps:', 'cyan');
        log('   1. Test build: cd myastosite && npm run build');
        log('   2. Test dev server: cd myastosite && npm run dev');
        log('   3. Deploy: git push origin main');
        
    } else {
        log('\n⚠️  Some issues detected!', 'yellow');
        log('❌ System may not be in stable state', 'red');
        
        log('\n🔧 Recommended Actions:', 'cyan');
        log('   1. Fix missing files');
        log('   2. Check package.json dependencies');
        log('   3. Verify Astro configuration');
        log('   4. Run this verification again');
        
        process.exit(1);
    }
    
    return allChecksPassed;
}

// Run verification if this script is executed directly
if (require.main === module) {
    verifyStableState();
}

module.exports = { verifyStableState, checkFileExists, checkPackageJson, checkAstroConfig }; 