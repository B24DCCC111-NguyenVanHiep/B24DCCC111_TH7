import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';

interface StatsCardsProps {
  totalTasks: number;
  completedTasks: number;
  myTasksCount: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  totalTasks,
  completedTasks,
  myTasksCount,
}) => (
  <Row gutter={16} style={{ marginBottom: 24 }}>
    <Col xs={24} md={8}>
      <Card>
        <Statistic title="Tổng công việc" value={totalTasks} />
      </Card>
    </Col>
    <Col xs={24} md={8}>
      <Card>
        <Statistic title="Đã hoàn thành" value={completedTasks} />
      </Card>
    </Col>
    <Col xs={24} md={8}>
      <Card>
        <Statistic title="Công việc của tôi" value={myTasksCount} />
      </Card>
    </Col>
  </Row>
);

export default StatsCards;
