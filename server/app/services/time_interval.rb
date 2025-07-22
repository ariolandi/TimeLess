class TimeInterval
  attr_reader :start_time
  attr_reader :end_time

  def initialize(start_time, end_time)
    @start_time = start_time.is_a?(TimeService) ? start_time : TimeService.new(start_time)
    @end_time = end_time.is_a?(TimeService) ? end_time : TimeService.new(end_time)
  end

  def is_inside(time)
    time =  TimeService.new(time) unless time.is_a?(TimeService)

    start_time <= time && time <= end_time
  end

  def is_subinterval(other)
    is_inside(other.start_time) && is_inside(other.end_time)
  end

  def duration
    @end_time - @start_time
  end
end