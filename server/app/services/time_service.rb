class TimeService
  attr_reader :hours
  attr_reader :minutes

  DEFAULT_YEAR = Date.parse("2000-01-01")

  def initialize(time)
    time ||= "00:00"

    if time.is_a?(Time)
        @hours = time.hour
        @minutes = time.min
        return
    end

    raise TypeError, "#{time} is not a string" unless time.is_a?(String)
    raise ArgumentError, "#{time} does not match hours:minutes format" unless time.match?(/^([01][0-9]|2[0-3]):[0-5][0-9]$/)
    @hours, @minutes = time.split(":").map { |x| x.to_i }
  end

  def str
    "#{hours_str}:#{minutes_str}"
  end

  def + (other)
    other = TimeService.from_minutes(other) if other.is_a?(Integer)

    raise TypeError unless other.is_a?(TimeService)
    TimeService.construct(hours + other.hours, minutes + other.minutes)
  end

  def - (other)
    other = other.to_minutes() unless other.is_a?(Integer)

    minutes = self.to_minutes()
    TimeService.from_minutes(minutes - other)
  end

  def > (other)
    other = TimeService.new(other) if other.is_a?(String) 

    hours > other.hours || (hours == other.hours && minutes > other.minutes)
  end

  def < (other)
    other = TimeService.new(other) if other.is_a?(String)

    hours < other.hours || (hours == other.hours && minutes < other.minutes)
  end

  def == (other)
    other.is_a?(String) ? str == other : str == other.str
  end

  def <= (other)
    self < other || self == other
  end

  def to_minutes
    @hours * 60 + @minutes
  end

  def to_datetime
    Time.zone.parse(str, DEFAULT_YEAR)
  end

  def self.from_minutes(minutes)
    TimeService.construct(minutes / 60, minutes % 60)
  end

  def self.construct(hours, minutes)
    if minutes >= 60
      hours += minutes / 60
      minutes %= 60
    end

    TimeService.new("#{"%02d" % hours}:#{"%02d" % minutes}")
  end

  def self.duration(starting, ending)
    starting = TimeService.new(starting) unless starting.is_a?(TimeService)
    ending = TimeService.new(ending) unless ending.is_a?(TimeService)

    ending - starting
  end

  private
  def hours_str
    "%02d" % hours
  end

  def minutes_str
    "%02d" % minutes
  end
end