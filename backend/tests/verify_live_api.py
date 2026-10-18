import requests

base = 'http://127.0.0.1:8000/api'

# Test curriculum
curr = requests.get(f'{base}/curriculum').json()
print('Curriculum Nodes:', len(curr['nodes']))

# Test route
route = requests.post(f'{base}/route', json={'algorithm': 'astar', 'start_node': 'node_a', 'goal_node': 'node_g'}).json()
print('A* Route:', route['path'], 'Cost:', route['total_cost'], 'Savings:', route.get('savings_hours'))

# Test all 10 labs
for i in range(1, 11):
    lid = f'lab_{i:02d}'
    res = requests.post(f'{base}/labs/{lid}/run', json={
        'start_node': 'node_a',
        'goal_node': 'node_g',
        'target_node': 'node_d',
        'quiz_score': 88,
        'confidence': 82,
        'assignment_completion': 92,
        'practice_frequency': 5,
        'algorithm': 'bfs',
        'query_type': 'can_unlock',
        'prompt': 'JavaScript event loop',
        'model_type': 'trigram',
        'max_tokens': 10
    }).json()
    msg = res.get('explanation') or res.get('result_message') or 'Success'
    print(f"{lid.upper()}: Success={res.get('success')} | {msg[:70]}...")
