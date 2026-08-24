import type {
  Package,
  Repository,
  Organization,
  GraphNode,
  GraphEdge,
  GraphData,
  ImpactAnalysis,
  DependencyPath,
  SearchResult,
} from './types';

// ---------------------------------------------------------------------------
// ORGANIZATIONS
// ---------------------------------------------------------------------------

export const organizations: Organization[] = [
  {
    id: 'org:psf',
    name: 'Python Software Foundation',
    description: 'The Python Software Foundation is the organization behind Python.',
    repositoryCount: 1,
    repositoryIds: ['repo:psf/requests'],
  },
  {
    id: 'org:fastapi',
    name: 'FastAPI',
    description: 'FastAPI framework organization.',
    repositoryCount: 1,
    repositoryIds: ['repo:fastapi/fastapi'],
  },
  {
    id: 'org:pydantic',
    name: 'Pydantic',
    description: 'Data validation using Python type hints.',
    repositoryCount: 1,
    repositoryIds: ['repo:pydantic/pydantic'],
  },
  {
    id: 'org:encode',
    name: 'Encode',
    description: 'The Encode open source organization — ASGI, Starlette, Uvicorn.',
    repositoryCount: 2,
    repositoryIds: ['repo:encode/starlette', 'repo:encode/uvicorn'],
  },
  {
    id: 'org:zulip',
    name: 'Zulip',
    description: 'Open source group chat for distributed teams.',
    repositoryCount: 1,
    repositoryIds: ['repo:zulip/zulip'],
  },
  {
    id: 'org:django',
    name: 'Django Software Foundation',
    description: 'The web framework for perfectionists with deadlines.',
    repositoryCount: 1,
    repositoryIds: ['repo:django/django'],
  },
  {
    id: 'org:ansible',
    name: 'Ansible',
    description: 'Automation for everyone.',
    repositoryCount: 1,
    repositoryIds: ['repo:ansible/ansible'],
  },
  {
    id: 'org:httpx',
    name: 'Encode HTTPX',
    description: 'A next-generation HTTP client for Python.',
    repositoryCount: 1,
    repositoryIds: ['repo:encode/httpx'],
  },
];

// ---------------------------------------------------------------------------
// PACKAGES
// ---------------------------------------------------------------------------

export const packages: Package[] = [
  {
    id: 'pkg:requests',
    name: 'requests',
    version: '2.32.3',
    ecosystem: 'PyPI',
    description: 'Python HTTP library — the elegant and simple HTTP client for Python.',
    dependencyCount: 8,
    dependentCount: 24,
    connectedRepositoryCount: 37,
    dependencies: ['pkg:urllib3', 'pkg:certifi', 'pkg:charset-normalizer', 'pkg:idna'],
    dependents: ['pkg:fastapi', 'pkg:httpx', 'pkg:requests-cache', 'pkg:requests-mock', 'pkg:responses', 'pkg:pip-tools'],
    homepage: 'https://requests.readthedocs.io',
    license: 'Apache-2.0',
  },
  {
    id: 'pkg:urllib3',
    name: 'urllib3',
    version: '2.2.2',
    ecosystem: 'PyPI',
    description: 'HTTP library with thread-safe connection pooling and file post support.',
    dependencyCount: 4,
    dependentCount: 18,
    connectedRepositoryCount: 12,
    dependencies: ['pkg:certifi', 'pkg:h2'],
    dependents: ['pkg:requests', 'pkg:httpx', 'pkg:botocore'],
    license: 'MIT',
  },
  {
    id: 'pkg:certifi',
    name: 'certifi',
    version: '2024.7.4',
    ecosystem: 'PyPI',
    description: 'Python package for providing Mozilla CA bundle.',
    dependencyCount: 0,
    dependentCount: 22,
    connectedRepositoryCount: 15,
    dependencies: [],
    dependents: ['pkg:requests', 'pkg:urllib3', 'pkg:httpx', 'pkg:botocore'],
    license: 'MPL-2.0',
  },
  {
    id: 'pkg:charset-normalizer',
    name: 'charset-normalizer',
    version: '3.3.2',
    ecosystem: 'PyPI',
    description: 'The Real First Universal Charset Detector.',
    dependencyCount: 0,
    dependentCount: 16,
    connectedRepositoryCount: 10,
    dependencies: [],
    dependents: ['pkg:requests', 'pkg:httpx'],
    license: 'MIT',
  },
  {
    id: 'pkg:idna',
    name: 'idna',
    version: '3.7',
    ecosystem: 'PyPI',
    description: 'Internationalized Domain Names in Applications (IDNA).',
    dependencyCount: 0,
    dependentCount: 20,
    connectedRepositoryCount: 14,
    dependencies: [],
    dependents: ['pkg:requests', 'pkg:httpx'],
    license: 'BSD-3-Clause',
  },
  {
    id: 'pkg:fastapi',
    name: 'fastapi',
    version: '0.111.0',
    ecosystem: 'PyPI',
    description: 'FastAPI framework — high performance, easy to learn, ready to code.',
    dependencyCount: 10,
    dependentCount: 15,
    connectedRepositoryCount: 28,
    dependencies: ['pkg:starlette', 'pkg:pydantic', 'pkg:pydantic-core', 'pkg:anyio', 'pkg:typing-extensions', 'pkg:httpx'],
    dependents: ['pkg:zulip-deps', 'pkg:fastapi-utils', 'pkg:fastapi-pagination'],
    license: 'MIT',
  },
  {
    id: 'pkg:starlette',
    name: 'starlette',
    version: '0.37.2',
    ecosystem: 'PyPI',
    description: 'The little ASGI framework that shines.',
    dependencyCount: 6,
    dependentCount: 12,
    connectedRepositoryCount: 9,
    dependencies: ['pkg:anyio', 'pkg:typing-extensions', 'pkg:httpx'],
    dependents: ['pkg:fastapi'],
    license: 'BSD-3-Clause',
  },
  {
    id: 'pkg:pydantic',
    name: 'pydantic',
    version: '2.8.2',
    ecosystem: 'PyPI',
    description: 'Data validation using Python type hints — fast and extensible.',
    dependencyCount: 7,
    dependentCount: 30,
    connectedRepositoryCount: 45,
    dependencies: ['pkg:pydantic-core', 'pkg:typing-extensions', 'pkg:annotated-types'],
    dependents: ['pkg:fastapi', 'pkg:sqlmodel', 'pkg:pydantic-settings'],
    license: 'MIT',
  },
  {
    id: 'pkg:pydantic-core',
    name: 'pydantic-core',
    version: '2.27.1',
    ecosystem: 'PyPI',
    description: 'Core validation logic for Pydantic, written in Rust.',
    dependencyCount: 2,
    dependentCount: 8,
    connectedRepositoryCount: 6,
    dependencies: ['pkg:typing-extensions'],
    dependents: ['pkg:pydantic', 'pkg:pydantic-settings'],
    license: 'MIT',
  },
  {
    id: 'pkg:anyio',
    name: 'anyio',
    version: '4.4.0',
    ecosystem: 'PyPI',
    description: 'High-level concurrency and networking library for Python.',
    dependencyCount: 3,
    dependentCount: 14,
    connectedRepositoryCount: 8,
    dependencies: ['pkg:typing-extensions', 'pkg:idna'],
    dependents: ['pkg:starlette', 'pkg:httpx', 'pkg:uvicorn'],
    license: 'MIT',
  },
  {
    id: 'pkg:typing-extensions',
    name: 'typing-extensions',
    version: '4.12.2',
    ecosystem: 'PyPI',
    description: 'Backported and experimental type hints for Python.',
    dependencyCount: 0,
    dependentCount: 35,
    connectedRepositoryCount: 50,
    dependencies: [],
    dependents: ['pkg:pydantic', 'pkg:starlette', 'pkg:anyio', 'pkg:fastapi', 'pkg:pydantic-core'],
    license: 'PSF-2.0',
  },
  {
    id: 'pkg:httpx',
    name: 'httpx',
    version: '0.27.0',
    ecosystem: 'PyPI',
    description: 'A next-generation HTTP client for Python, with sync and async support.',
    dependencyCount: 5,
    dependentCount: 19,
    connectedRepositoryCount: 22,
    dependencies: ['pkg:certifi', 'pkg:charset-normalizer', 'pkg:idna', 'pkg:anyio'],
    dependents: ['pkg:fastapi', 'pkg:starlette', 'pkg:respx'],
    license: 'BSD-3-Clause',
  },
  {
    id: 'pkg:annotated-types',
    name: 'annotated-types',
    version: '0.7.0',
    ecosystem: 'PyPI',
    description: 'Reusable constraint types for Python typing.Annotated.',
    dependencyCount: 0,
    dependentCount: 6,
    connectedRepositoryCount: 4,
    dependencies: [],
    dependents: ['pkg:pydantic'],
    license: 'MIT',
  },
  {
    id: 'pkg:h2',
    name: 'h2',
    version: '4.1.0',
    ecosystem: 'PyPI',
    description: 'HTTP/2 framing layer for Python, used in hyper and httpx.',
    dependencyCount: 2,
    dependentCount: 5,
    connectedRepositoryCount: 3,
    dependencies: ['pkg:hyperframe', 'pkg:hpack'],
    dependents: ['pkg:urllib3', 'pkg:httpx'],
    license: 'MIT',
  },
  {
    id: 'pkg:hyperframe',
    name: 'hyperframe',
    version: '6.0.1',
    ecosystem: 'PyPI',
    description: 'HTTP/2 framing logic for Python.',
    dependencyCount: 0,
    dependentCount: 3,
    connectedRepositoryCount: 2,
    dependencies: [],
    dependents: ['pkg:h2'],
    license: 'MIT',
  },
  {
    id: 'pkg:hpack',
    name: 'hpack',
    version: '4.0.0',
    ecosystem: 'PyPI',
    description: 'Pure-Python HPACK header compression for HTTP/2.',
    dependencyCount: 0,
    dependentCount: 3,
    connectedRepositoryCount: 2,
    dependencies: [],
    dependents: ['pkg:h2'],
    license: 'MIT',
  },
  {
    id: 'pkg:uvicorn',
    name: 'uvicorn',
    version: '0.30.1',
    ecosystem: 'PyPI',
    description: 'The lightning-fast ASGI server for Python.',
    dependencyCount: 5,
    dependentCount: 11,
    connectedRepositoryCount: 7,
    dependencies: ['pkg:click', 'pkg:h11', 'pkg:anyio'],
    dependents: ['pkg:fastapi-cli', 'pkg:uvicorn-worker'],
    license: 'BSD-3-Clause',
  },
  {
    id: 'pkg:click',
    name: 'click',
    version: '8.1.7',
    ecosystem: 'PyPI',
    description: 'Composable command line interface creation kit for Python.',
    dependencyCount: 1,
    dependentCount: 28,
    connectedRepositoryCount: 40,
    dependencies: ['pkg:colorama'],
    dependents: ['pkg:uvicorn', 'pkg:pip-tools', 'pkg:flask-cli'],
    license: 'BSD-3-Clause',
  },
  {
    id: 'pkg:colorama',
    name: 'colorama',
    version: '0.4.6',
    ecosystem: 'PyPI',
    description: 'Cross-platform colored terminal text for Python.',
    dependencyCount: 0,
    dependentCount: 24,
    connectedRepositoryCount: 30,
    dependencies: [],
    dependents: ['pkg:click'],
    license: 'BSD-3-Clause',
  },
  {
    id: 'pkg:h11',
    name: 'h11',
    version: '0.14.0',
    ecosystem: 'PyPI',
    description: 'A pure-Python HTTP/1.1 protocol library for Python.',
    dependencyCount: 0,
    dependentCount: 7,
    connectedRepositoryCount: 5,
    dependencies: [],
    dependents: ['pkg:uvicorn', 'pkg:httpcore'],
    license: 'MIT',
  },
  {
    id: 'pkg:httpcore',
    name: 'httpcore',
    version: '1.0.5',
    ecosystem: 'PyPI',
    description: 'A minimal low-level HTTP client core for Python.',
    dependencyCount: 3,
    dependentCount: 4,
    connectedRepositoryCount: 3,
    dependencies: ['pkg:certifi', 'pkg:h11'],
    dependents: ['pkg:httpx'],
    license: 'BSD-3-Clause',
  },
  {
    id: 'pkg:pydantic-settings',
    name: 'pydantic-settings',
    version: '2.4.0',
    ecosystem: 'PyPI',
    description: 'Settings management using Pydantic — load from env, dotenv, and more.',
    dependencyCount: 3,
    dependentCount: 9,
    connectedRepositoryCount: 11,
    dependencies: ['pkg:pydantic', 'pkg:python-dotenv'],
    dependents: ['pkg:fastapi-cli', 'pkg:config-manager'],
    license: 'MIT',
  },
  {
    id: 'pkg:python-dotenv',
    name: 'python-dotenv',
    version: '1.0.1',
    ecosystem: 'PyPI',
    description: 'Read key-value pairs from a .env file and set them as environment variables.',
    dependencyCount: 0,
    dependentCount: 18,
    connectedRepositoryCount: 20,
    dependencies: [],
    dependents: ['pkg:pydantic-settings'],
    license: 'BSD-3-Clause',
  },
  {
    id: 'pkg:sqlmodel',
    name: 'sqlmodel',
    version: '0.0.21',
    ecosystem: 'PyPI',
    description: 'SQL databases in Python, designed for simplicity and compatibility with FastAPI.',
    dependencyCount: 4,
    dependentCount: 6,
    connectedRepositoryCount: 8,
    dependencies: ['pkg:pydantic', 'pkg:sqlalchemy', 'pkg:fastapi'],
    dependents: ['pkg:fastapi-crudrouter'],
    license: 'MIT',
  },
  {
    id: 'pkg:sqlalchemy',
    name: 'sqlalchemy',
    version: '2.0.30',
    ecosystem: 'PyPI',
    description: 'The Database Toolkit for Python — SQL ORM and Core.',
    dependencyCount: 2,
    dependentCount: 26,
    connectedRepositoryCount: 35,
    dependencies: ['pkg:typing-extensions', 'pkg:greenlet'],
    dependents: ['pkg:sqlmodel', 'pkg:alembic'],
    license: 'MIT',
  },
  {
    id: 'pkg:greenlet',
    name: 'greenlet',
    version: '3.0.3',
    ecosystem: 'PyPI',
    description: 'Lightweight in-process concurrent programming for Python.',
    dependencyCount: 0,
    dependentCount: 10,
    connectedRepositoryCount: 12,
    dependencies: [],
    dependents: ['pkg:sqlalchemy'],
    license: 'MIT',
  },
  {
    id: 'pkg:alembic',
    name: 'alembic',
    version: '1.13.2',
    ecosystem: 'PyPI',
    description: 'A database migration tool for SQLAlchemy.',
    dependencyCount: 2,
    dependentCount: 8,
    connectedRepositoryCount: 9,
    dependencies: ['pkg:sqlalchemy', 'pkg:typing-extensions'],
    dependents: ['pkg:fastapi-alembic'],
    license: 'MIT',
  },
  {
    id: 'pkg:botocore',
    name: 'botocore',
    version: '1.34.131',
    ecosystem: 'PyPI',
    description: 'Low-level, data-driven core of the AWS SDK for Python (boto3).',
    dependencyCount: 4,
    dependentCount: 5,
    connectedRepositoryCount: 4,
    dependencies: ['pkg:certifi', 'pkg:jmespath', 'pkg:python-dateutil', 'pkg:urllib3'],
    dependents: ['pkg:boto3'],
    license: 'Apache-2.0',
  },
  {
    id: 'pkg:boto3',
    name: 'boto3',
    version: '1.34.131',
    ecosystem: 'PyPI',
    description: 'The AWS SDK for Python.',
    dependencyCount: 3,
    dependentCount: 12,
    connectedRepositoryCount: 18,
    dependencies: ['pkg:botocore', 'pkg:jmespath', 'pkg:s3transfer'],
    dependents: ['pkg:aws-cli'],
    license: 'Apache-2.0',
  },
  {
    id: 'pkg:jmespath',
    name: 'jmespath',
    version: '1.0.1',
    ecosystem: 'PyPI',
    description: 'JSON Matching Expressions — query language for JSON.',
    dependencyCount: 0,
    dependentCount: 8,
    connectedRepositoryCount: 6,
    dependencies: [],
    dependents: ['pkg:botocore', 'pkg:boto3'],
    license: 'MIT',
  },
  {
    id: 'pkg:python-dateutil',
    name: 'python-dateutil',
    version: '2.9.0',
    ecosystem: 'PyPI',
    description: 'Extensions to the standard Python datetime module.',
    dependencyCount: 1,
    dependentCount: 22,
    connectedRepositoryCount: 25,
    dependencies: ['pkg:six'],
    dependents: ['pkg:botocore', 'pkg:pandas'],
    license: 'BSD-3-Clause',
  },
  {
    id: 'pkg:six',
    name: 'six',
    version: '1.16.0',
    ecosystem: 'PyPI',
    description: 'Python 2 and 3 compatibility utilities.',
    dependencyCount: 0,
    dependentCount: 30,
    connectedRepositoryCount: 40,
    dependencies: [],
    dependents: ['pkg:python-dateutil'],
    license: 'MIT',
  },
  {
    id: 'pkg:s3transfer',
    name: 's3transfer',
    version: '0.10.2',
    ecosystem: 'PyPI',
    description: 'An Amazon S3 transfer manager for Python.',
    dependencyCount: 2,
    dependentCount: 3,
    connectedRepositoryCount: 2,
    dependencies: ['pkg:botocore'],
    dependents: ['pkg:boto3'],
    license: 'Apache-2.0',
  },
  {
    id: 'pkg:pandas',
    name: 'pandas',
    version: '2.2.2',
    ecosystem: 'PyPI',
    description: 'Powerful data structures for data analysis, time series, and statistics.',
    dependencyCount: 6,
    dependentCount: 40,
    connectedRepositoryCount: 60,
    dependencies: ['pkg:numpy', 'pkg:python-dateutil', 'pkg:pytz'],
    dependents: ['pkg:geopandas', 'pkg:pandas-stubs'],
    license: 'BSD-3-Clause',
  },
  {
    id: 'pkg:numpy',
    name: 'numpy',
    version: '1.26.4',
    ecosystem: 'PyPI',
    description: 'Fundamental package for array computing in Python.',
    dependencyCount: 0,
    dependentCount: 50,
    connectedRepositoryCount: 80,
    dependencies: [],
    dependents: ['pkg:pandas', 'pkg:scipy', 'pkg:matplotlib'],
    license: 'BSD-3-Clause',
  },
  {
    id: 'pkg:pytz',
    name: 'pytz',
    version: '2024.1',
    ecosystem: 'PyPI',
    description: 'World timezone definitions, modern and historical.',
    dependencyCount: 0,
    dependentCount: 18,
    connectedRepositoryCount: 22,
    dependencies: [],
    dependents: ['pkg:pandas'],
    license: 'MIT',
  },
  {
    id: 'pkg:requests-cache',
    name: 'requests-cache',
    version: '1.2.1',
    ecosystem: 'PyPI',
    description: 'Persistent HTTP cache for the Python requests library.',
    dependencyCount: 4,
    dependentCount: 3,
    connectedRepositoryCount: 4,
    dependencies: ['pkg:requests', 'pkg:url-normalize'],
    dependents: [],
    license: 'MIT',
  },
  {
    id: 'pkg:requests-mock',
    name: 'requests-mock',
    version: '1.12.1',
    ecosystem: 'PyPI',
    description: 'Mock out responses from the requests package.',
    dependencyCount: 2,
    dependentCount: 4,
    connectedRepositoryCount: 5,
    dependencies: ['pkg:requests', 'pkg:six'],
    dependents: [],
    license: 'Apache-2.0',
  },
  {
    id: 'pkg:responses',
    name: 'responses',
    version: '0.25.3',
    ecosystem: 'PyPI',
    description: 'A utility for mocking out the Python requests library.',
    dependencyCount: 3,
    dependentCount: 5,
    connectedRepositoryCount: 6,
    dependencies: ['pkg:requests', 'pkg:pyyaml', 'pkg:toml'],
    dependents: [],
    license: 'Apache-2.0',
  },
  {
    id: 'pkg:pip-tools',
    name: 'pip-tools',
    version: '7.4.1',
    ecosystem: 'PyPI',
    description: 'A set of tools to keep your pinned Python dependencies fresh.',
    dependencyCount: 3,
    dependentCount: 2,
    connectedRepositoryCount: 3,
    dependencies: ['pkg:click', 'pkg:requests', 'pkg:pip'],
    dependents: [],
    license: 'BSD-3-Clause',
  },
  {
    id: 'pkg:pyyaml',
    name: 'pyyaml',
    version: '6.0.1',
    ecosystem: 'PyPI',
    description: 'YAML parser and emitter for Python.',
    dependencyCount: 0,
    dependentCount: 35,
    connectedRepositoryCount: 45,
    dependencies: [],
    dependents: ['pkg:responses', 'pkg:ansible-core'],
    license: 'MIT',
  },
  {
    id: 'pkg:ansible-core',
    name: 'ansible-core',
    version: '2.17.1',
    ecosystem: 'PyPI',
    description: 'Radically simple IT automation — core runtime and modules.',
    dependencyCount: 5,
    dependentCount: 8,
    connectedRepositoryCount: 10,
    dependencies: ['pkg:pyyaml', 'pkg:jinja2', 'pkg:click'],
    dependents: ['pkg:ansible'],
    license: 'GPL-3.0',
  },
  {
    id: 'pkg:jinja2',
    name: 'jinja2',
    version: '3.1.4',
    ecosystem: 'PyPI',
    description: 'A very fast and expressive template engine for Python.',
    dependencyCount: 1,
    dependentCount: 28,
    connectedRepositoryCount: 35,
    dependencies: ['pkg:markupsafe'],
    dependents: ['pkg:ansible-core', 'pkg:flask'],
    license: 'BSD-3-Clause',
  },
  {
    id: 'pkg:markupsafe',
    name: 'markupsafe',
    version: '2.1.5',
    ecosystem: 'PyPI',
    description: 'Safely add untrusted strings to HTML/XML markup.',
    dependencyCount: 0,
    dependentCount: 20,
    connectedRepositoryCount: 28,
    dependencies: [],
    dependents: ['pkg:jinja2'],
    license: 'BSD-3-Clause',
  },
  {
    id: 'pkg:flask',
    name: 'flask',
    version: '3.0.3',
    ecosystem: 'PyPI',
    description: 'A lightweight WSGI web application framework for Python.',
    dependencyCount: 4,
    dependentCount: 22,
    connectedRepositoryCount: 30,
    dependencies: ['pkg:click', 'pkg:jinja2', 'pkg:werkzeug', 'pkg:itsdangerous'],
    dependents: ['pkg:flask-restful', 'pkg:flask-login'],
    license: 'BSD-3-Clause',
  },
  {
    id: 'pkg:werkzeug',
    name: 'werkzeug',
    version: '3.0.3',
    ecosystem: 'PyPI',
    description: 'The comprehensive WSGI web application library for Python.',
    dependencyCount: 2,
    dependentCount: 14,
    connectedRepositoryCount: 18,
    dependencies: ['pkg:markupsafe'],
    dependents: ['pkg:flask'],
    license: 'BSD-3-Clause',
  },
  {
    id: 'pkg:itsdangerous',
    name: 'itsdangerous',
    version: '2.2.0',
    ecosystem: 'PyPI',
    description: 'Safely pass trusted data to untrusted environments and back.',
    dependencyCount: 0,
    dependentCount: 10,
    connectedRepositoryCount: 12,
    dependencies: [],
    dependents: ['pkg:flask'],
    license: 'BSD-3-Clause',
  },
  {
    id: 'pkg:django',
    name: 'django',
    version: '5.0.7',
    ecosystem: 'PyPI',
    description: 'The web framework for perfectionists with deadlines.',
    dependencyCount: 4,
    dependentCount: 35,
    connectedRepositoryCount: 50,
    dependencies: ['pkg:asgiref', 'pkg:sqlparse'],
    dependents: ['pkg:django-rest-framework', 'pkg:django-cors-headers'],
    license: 'BSD-3-Clause',
  },
  {
    id: 'pkg:asgiref',
    name: 'asgiref',
    version: '3.8.1',
    ecosystem: 'PyPI',
    description: 'ASGI specs, utility functions, and reference implementations.',
    dependencyCount: 0,
    dependentCount: 15,
    connectedRepositoryCount: 20,
    dependencies: [],
    dependents: ['pkg:django', 'pkg:uvicorn'],
    license: 'BSD-3-Clause',
  },
  {
    id: 'pkg:sqlparse',
    name: 'sqlparse',
    version: '0.5.0',
    ecosystem: 'PyPI',
    description: 'Non-validating SQL parser and formatter for Python.',
    dependencyCount: 0,
    dependentCount: 12,
    connectedRepositoryCount: 15,
    dependencies: [],
    dependents: ['pkg:django'],
    license: 'BSD-3-Clause',
  },
  {
    id: 'pkg:django-rest-framework',
    name: 'djangorestframework',
    version: '3.15.1',
    ecosystem: 'PyPI',
    description: 'Web APIs for Django — powerful and flexible toolkit.',
    dependencyCount: 1,
    dependentCount: 18,
    connectedRepositoryCount: 25,
    dependencies: ['pkg:django'],
    dependents: [],
    license: 'BSD-2-Clause',
  },
];

// ---------------------------------------------------------------------------
// REPOSITORIES
// ---------------------------------------------------------------------------

export const repositories: Repository[] = [
  {
    id: 'repo:psf/requests',
    owner: 'psf',
    name: 'requests',
    fullName: 'psf/requests',
    description: 'Python HTTP library — the elegant and simple HTTP client for Python.',
    primaryLanguage: 'Python',
    totalDependencies: 8,
    directDependencies: 4,
    transitiveDependencies: 4,
    connectedPackages: 8,
    dependencyPackages: ['pkg:urllib3', 'pkg:certifi', 'pkg:charset-normalizer', 'pkg:idna'],
    organizationId: 'org:psf',
    stars: 51000,
  },
  {
    id: 'repo:fastapi/fastapi',
    owner: 'fastapi',
    name: 'fastapi',
    fullName: 'fastapi/fastapi',
    description: 'FastAPI framework — high performance, easy to learn, ready to code.',
    primaryLanguage: 'Python',
    totalDependencies: 18,
    directDependencies: 6,
    transitiveDependencies: 12,
    connectedPackages: 18,
    dependencyPackages: ['pkg:starlette', 'pkg:pydantic', 'pkg:pydantic-core', 'pkg:anyio', 'pkg:typing-extensions', 'pkg:httpx'],
    organizationId: 'org:fastapi',
    stars: 73000,
  },
  {
    id: 'repo:pydantic/pydantic',
    owner: 'pydantic',
    name: 'pydantic',
    fullName: 'pydantic/pydantic',
    description: 'Data validation using Python type hints — fast and extensible.',
    primaryLanguage: 'Python',
    totalDependencies: 7,
    directDependencies: 3,
    transitiveDependencies: 4,
    connectedPackages: 7,
    dependencyPackages: ['pkg:pydantic-core', 'pkg:typing-extensions', 'pkg:annotated-types'],
    organizationId: 'org:pydantic',
    stars: 19500,
  },
  {
    id: 'repo:encode/starlette',
    owner: 'encode',
    name: 'starlette',
    fullName: 'encode/starlette',
    description: 'The little ASGI framework that shines.',
    primaryLanguage: 'Python',
    totalDependencies: 6,
    directDependencies: 3,
    transitiveDependencies: 3,
    connectedPackages: 6,
    dependencyPackages: ['pkg:anyio', 'pkg:typing-extensions', 'pkg:httpx'],
    organizationId: 'org:encode',
    stars: 9800,
  },
  {
    id: 'repo:encode/uvicorn',
    owner: 'encode',
    name: 'uvicorn',
    fullName: 'encode/uvicorn',
    description: 'The lightning-fast ASGI server for Python.',
    primaryLanguage: 'Python',
    totalDependencies: 5,
    directDependencies: 3,
    transitiveDependencies: 2,
    connectedPackages: 5,
    dependencyPackages: ['pkg:click', 'pkg:h11', 'pkg:anyio'],
    organizationId: 'org:encode',
    stars: 8500,
  },
  {
    id: 'repo:encode/httpx',
    owner: 'encode',
    name: 'httpx',
    fullName: 'encode/httpx',
    description: 'A next-generation HTTP client for Python.',
    primaryLanguage: 'Python',
    totalDependencies: 8,
    directDependencies: 4,
    transitiveDependencies: 4,
    connectedPackages: 8,
    dependencyPackages: ['pkg:certifi', 'pkg:charset-normalizer', 'pkg:idna', 'pkg:anyio'],
    organizationId: 'org:httpx',
    stars: 12000,
  },
  {
    id: 'repo:zulip/zulip',
    owner: 'zulip',
    name: 'zulip',
    fullName: 'zulip/zulip',
    description: 'Open source group chat platform for distributed teams.',
    primaryLanguage: 'Python',
    totalDependencies: 42,
    directDependencies: 18,
    transitiveDependencies: 24,
    connectedPackages: 42,
    dependencyPackages: ['pkg:requests', 'pkg:fastapi', 'pkg:pydantic', 'pkg:django', 'pkg:psycopg2', 'pkg:redis', 'pkg:celery'],
    organizationId: 'org:zulip',
    stars: 21000,
  },
  {
    id: 'repo:django/django',
    owner: 'django',
    name: 'django',
    fullName: 'django/django',
    description: 'The web framework for perfectionists with deadlines.',
    primaryLanguage: 'Python',
    totalDependencies: 4,
    directDependencies: 2,
    transitiveDependencies: 2,
    connectedPackages: 4,
    dependencyPackages: ['pkg:asgiref', 'pkg:sqlparse'],
    organizationId: 'org:django',
    stars: 78000,
  },
  {
    id: 'repo:ansible/ansible',
    owner: 'ansible',
    name: 'ansible',
    fullName: 'ansible/ansible',
    description: 'Radically simple IT automation for app deployment and config management.',
    primaryLanguage: 'Python',
    totalDependencies: 12,
    directDependencies: 5,
    transitiveDependencies: 7,
    connectedPackages: 12,
    dependencyPackages: ['pkg:ansible-core', 'pkg:pyyaml', 'pkg:jinja2', 'pkg:click', 'pkg:requests'],
    organizationId: 'org:ansible',
    stars: 61000,
  },
  {
    id: 'repo:sqlalchemy/sqlalchemy',
    owner: 'sqlalchemy',
    name: 'sqlalchemy',
    fullName: 'sqlalchemy/sqlalchemy',
    description: 'The Database Toolkit for Python — SQL ORM and Core.',
    primaryLanguage: 'Python',
    totalDependencies: 2,
    directDependencies: 2,
    transitiveDependencies: 0,
    connectedPackages: 2,
    dependencyPackages: ['pkg:typing-extensions', 'pkg:greenlet'],
    stars: 9000,
  },
  {
    id: 'repo:pandas-dev/pandas',
    owner: 'pandas-dev',
    name: 'pandas',
    fullName: 'pandas-dev/pandas',
    description: 'Flexible and powerful data analysis / manipulation library for Python.',
    primaryLanguage: 'Python',
    totalDependencies: 6,
    directDependencies: 3,
    transitiveDependencies: 3,
    connectedPackages: 6,
    dependencyPackages: ['pkg:numpy', 'pkg:python-dateutil', 'pkg:pytz'],
    stars: 43000,
  },
  {
    id: 'repo:botocore/botocore',
    owner: 'boto',
    name: 'botocore',
    fullName: 'boto/botocore',
    description: 'Low-level, data-driven core of the AWS SDK for Python (boto3).',
    primaryLanguage: 'Python',
    totalDependencies: 4,
    directDependencies: 4,
    transitiveDependencies: 0,
    connectedPackages: 4,
    dependencyPackages: ['pkg:certifi', 'pkg:jmespath', 'pkg:python-dateutil', 'pkg:urllib3'],
    stars: 2200,
  },
  {
    id: 'repo: pallets/flask',
    owner: 'pallets',
    name: 'flask',
    fullName: 'pallets/flask',
    description: 'A lightweight WSGI web application framework for Python.',
    primaryLanguage: 'Python',
    totalDependencies: 4,
    directDependencies: 4,
    transitiveDependencies: 0,
    connectedPackages: 4,
    dependencyPackages: ['pkg:click', 'pkg:jinja2', 'pkg:werkzeug', 'pkg:itsdangerous'],
    stars: 67000,
  },
  {
    id: 'repo:project-alpha/project-alpha',
    owner: 'project-alpha',
    name: 'project-alpha',
    fullName: 'project-alpha/project-alpha',
    description: 'Internal analytics service — uses FastAPI for API layer and requests for external calls.',
    primaryLanguage: 'Python',
    totalDependencies: 12,
    directDependencies: 3,
    transitiveDependencies: 9,
    connectedPackages: 12,
    dependencyPackages: ['pkg:fastapi', 'pkg:requests', 'pkg:pydantic'],
    stars: 0,
  },
  {
    id: 'repo:project-beta/project-beta',
    owner: 'project-beta',
    name: 'project-beta',
    fullName: 'project-beta/project-beta',
    description: 'Microservice framework built on top of FastAPI and Starlette.',
    primaryLanguage: 'Python',
    totalDependencies: 15,
    directDependencies: 2,
    transitiveDependencies: 13,
    connectedPackages: 15,
    dependencyPackages: ['pkg:fastapi', 'pkg:starlette'],
    stars: 0,
  },
  {
    id: 'repo:project-gamma/project-gamma',
    owner: 'project-gamma',
    name: 'project-gamma',
    fullName: 'project-gamma/project-gamma',
    description: 'Data pipeline service using SQLAlchemy, pandas, and botocore.',
    primaryLanguage: 'Python',
    totalDependencies: 18,
    directDependencies: 3,
    transitiveDependencies: 15,
    connectedPackages: 18,
    dependencyPackages: ['pkg:sqlalchemy', 'pkg:pandas', 'pkg:botocore'],
    stars: 0,
  },
];

// ---------------------------------------------------------------------------
// EDGE CONSTRUCTION
// ---------------------------------------------------------------------------

export function buildAllEdges(): GraphEdge[] {
  const edges: GraphEdge[] = [];

  // Package DEPENDS_ON Package
  for (const pkg of packages) {
    for (const depId of pkg.dependencies) {
      edges.push({
        id: `edge:${pkg.id}->${depId}`,
        source: pkg.id,
        target: depId,
        type: 'DEPENDS_ON',
      });
    }
  }

  // Repository DEPENDS_ON Package
  for (const repo of repositories) {
    for (const depId of repo.dependencyPackages) {
      edges.push({
        id: `edge:${repo.id}->${depId}`,
        source: repo.id,
        target: depId,
        type: 'DEPENDS_ON',
      });
    }
  }

  // Repository OWNED_BY Organization
  for (const repo of repositories) {
    if (repo.organizationId) {
      edges.push({
        id: `edge:${repo.id}->${repo.organizationId}`,
        source: repo.id,
        target: repo.organizationId,
        type: 'OWNED_BY',
      });
    }
  }

  return edges;
}

export const allEdges: GraphEdge[] = buildAllEdges();

// ---------------------------------------------------------------------------
// NODE CONSTRUCTION
// ---------------------------------------------------------------------------

export function buildAllNodes(): GraphNode[] {
  const nodes: GraphNode[] = [];

  for (const pkg of packages) {
    nodes.push({
      id: pkg.id,
      label: pkg.name,
      type: 'package',
      metadata: {
        ecosystem: pkg.ecosystem,
        version: pkg.version,
        description: pkg.description,
        dependencyCount: pkg.dependencyCount,
        dependentCount: pkg.dependentCount,
        connectedRepositoryCount: pkg.connectedRepositoryCount,
      },
    });
  }

  for (const repo of repositories) {
    nodes.push({
      id: repo.id,
      label: repo.fullName,
      type: 'repository',
      metadata: {
        language: repo.primaryLanguage,
        description: repo.description,
      },
    });
  }

  for (const org of organizations) {
    nodes.push({
      id: org.id,
      label: org.name,
      type: 'organization',
      metadata: {
        description: org.description,
      },
    });
  }

  return nodes;
}

export const allNodes: GraphNode[] = buildAllNodes();

// ---------------------------------------------------------------------------
// LOOKUP HELPERS
// ---------------------------------------------------------------------------

export function getNodeById(id: string): GraphNode | undefined {
  return allNodes.find((n) => n.id === id);
}

export function getPackageById(id: string): Package | undefined {
  return packages.find((p) => p.id === id);
}

export function getPackageByName(name: string): Package | undefined {
  return packages.find((p) => p.name === name.toLowerCase());
}

export function getRepositoryByOwnerName(owner: string, name: string): Repository | undefined {
  return repositories.find((r) => r.owner === owner.toLowerCase() && r.name === name.toLowerCase());
}

export function getRepositoryById(id: string): Repository | undefined {
  return repositories.find((r) => r.id === id);
}

export function getOrganizationById(id: string): Organization | undefined {
  return organizations.find((o) => o.id === id);
}

// ---------------------------------------------------------------------------
// GRAPH TRAVERSAL
// ---------------------------------------------------------------------------

export function getNeighbors(nodeId: string, edges: GraphEdge[] = allEdges): string[] {
  const neighborSet = new Set<string>();
  for (const edge of edges) {
    if (edge.source === nodeId) neighborSet.add(edge.target);
    if (edge.target === nodeId) neighborSet.add(edge.source);
  }
  return Array.from(neighborSet);
}

export function getOutgoingNeighbors(nodeId: string, edges: GraphEdge[] = allEdges): string[] {
  const neighborSet = new Set<string>();
  for (const edge of edges) {
    if (edge.source === nodeId) neighborSet.add(edge.target);
  }
  return Array.from(neighborSet);
}

export function getIncomingNeighbors(nodeId: string, edges: GraphEdge[] = allEdges): string[] {
  const neighborSet = new Set<string>();
  for (const edge of edges) {
    if (edge.target === nodeId) neighborSet.add(edge.source);
  }
  return Array.from(neighborSet);
}

/**
 * BFS traversal from a node up to a given depth.
 * direction: 'outgoing' = dependencies, 'incoming' = dependents, 'both' = all
 */
export function traverseGraph(
  startId: string,
  depth: number,
  direction: 'outgoing' | 'incoming' | 'both' = 'both',
  edges: GraphEdge[] = allEdges,
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const visited = new Set<string>();
  const visitedEdges = new Set<string>();
  const resultNodes: GraphNode[] = [];
  const resultEdges: GraphEdge[] = [];

  const queue: { id: string; currentDepth: number }[] = [{ id: startId, currentDepth: 0 }];
  visited.add(startId);

  while (queue.length > 0) {
    const { id, currentDepth } = queue.shift()!;

    const node = getNodeById(id);
    if (node) resultNodes.push(node);

    if (currentDepth >= depth) continue;

    const neighbors: string[] = [];
    for (const edge of edges) {
      if (direction === 'outgoing' || direction === 'both') {
        if (edge.source === id && !visited.has(edge.target)) {
          neighbors.push(edge.target);
          visitedEdges.add(edge.id);
          resultEdges.push(edge);
        } else if (edge.source === id && visited.has(edge.target)) {
          visitedEdges.add(edge.id);
          resultEdges.push(edge);
        }
      }
      if (direction === 'incoming' || direction === 'both') {
        if (edge.target === id && !visited.has(edge.source)) {
          neighbors.push(edge.source);
          visitedEdges.add(edge.id);
          resultEdges.push(edge);
        } else if (edge.target === id && visited.has(edge.source)) {
          visitedEdges.add(edge.id);
          resultEdges.push(edge);
        }
      }
    }

    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push({ id: neighborId, currentDepth: currentDepth + 1 });
      }
    }
  }

  // Deduplicate edges
  const uniqueEdges = Array.from(new Map(resultEdges.map((e) => [e.id, e])).values());

  return { nodes: resultNodes, edges: uniqueEdges };
}

/**
 * Find a shortest path between two nodes using BFS.
 */
export function findPath(
  sourceId: string,
  targetId: string,
  edges: GraphEdge[] = allEdges,
): DependencyPath | null {
  if (sourceId === targetId) {
    const node = getNodeById(sourceId);
    if (!node) return null;
    return {
      id: `path:${sourceId}->${targetId}`,
      sourceId,
      targetId,
      hops: 0,
      nodes: [node],
      edges: [],
    };
  }

  const queue: { id: string; path: string[]; edgePath: string[] }[] = [
    { id: sourceId, path: [sourceId], edgePath: [] },
  ];
  const visited = new Set<string>([sourceId]);

  while (queue.length > 0) {
    const { id, path, edgePath } = queue.shift()!;

    for (const edge of edges) {
      let nextId: string | null = null;
      if (edge.source === id && !visited.has(edge.target)) {
        nextId = edge.target;
      } else if (edge.target === id && !visited.has(edge.source)) {
        nextId = edge.source;
      }

      if (nextId) {
        const newPath = [...path, nextId];
        const newEdgePath = [...edgePath, edge.id];

        if (nextId === targetId) {
          const pathNodes = newPath.map((nid) => getNodeById(nid)).filter(Boolean) as GraphNode[];
          const pathEdges = newEdgePath
            .map((eid) => edges.find((e) => e.id === eid))
            .filter(Boolean) as GraphEdge[];
          return {
            id: `path:${sourceId}->${targetId}`,
            sourceId,
            targetId,
            hops: pathNodes.length - 1,
            nodes: pathNodes,
            edges: pathEdges,
          };
        }

        visited.add(nextId);
        queue.push({ id: nextId, path: newPath, edgePath: newEdgePath });
      }
    }
  }

  return null;
}

/**
 * Find all paths from a node to its dependents/dependencies up to a given depth.
 */
export function findAllPaths(
  startId: string,
  depth: number,
  direction: 'dependents' | 'dependencies' = 'dependents',
  edges: GraphEdge[] = allEdges,
): { nodes: GraphNode[]; edges: GraphEdge[] }[] {
  const dir = direction === 'dependents' ? 'incoming' : 'outgoing';
  const results: { nodes: GraphNode[]; edges: GraphEdge[] }[] = [];
  const paths: { id: string; path: string[]; edgePath: string[] }[] = [
    { id: startId, path: [startId], edgePath: [] },
  ];

  while (paths.length > 0) {
    const { id, path, edgePath } = paths.shift()!;
    if (path.length - 1 >= depth) {
      const pathNodes = path.map((nid) => getNodeById(nid)).filter(Boolean) as GraphNode[];
      const pathEdges = edgePath
        .map((eid) => edges.find((e) => e.id === eid))
        .filter(Boolean) as GraphEdge[];
      if (pathNodes.length > 1) {
        results.push({ nodes: pathNodes, edges: pathEdges });
      }
      continue;
    }

    let hasNeighbors = false;
    for (const edge of edges) {
      let nextId: string | null = null;
      if (dir === 'incoming' && edge.target === id) {
        nextId = edge.source;
      } else if (dir === 'outgoing' && edge.source === id) {
        nextId = edge.target;
      }

      if (nextId && !path.includes(nextId)) {
        hasNeighbors = true;
        paths.push({
          id: nextId,
          path: [...path, nextId],
          edgePath: [...edgePath, edge.id],
        });
      }
    }

    if (!hasNeighbors && path.length > 1) {
      const pathNodes = path.map((nid) => getNodeById(nid)).filter(Boolean) as GraphNode[];
      const pathEdges = edgePath
        .map((eid) => edges.find((e) => e.id === eid))
        .filter(Boolean) as GraphEdge[];
      results.push({ nodes: pathNodes, edges: pathEdges });
    }
  }

  return results;
}
